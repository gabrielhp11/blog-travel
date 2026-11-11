import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { env } from "@/lib/env";
import { verifyHmac } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/http";
import { hashIp } from "@/lib/crypto";
import { webhookSchema } from "@/lib/validation";
import { readTextBody } from "@/lib/request-body";

const maxClockSkewSeconds = 300;

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "Content-Type deve ser application/json." }, { status: 415 });
  }
  const origin = request.headers.get("origin");
  const allowedOrigins = env.WEBHOOK_ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean);
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "Origem do webhook não autorizada." }, { status: 403 });
  }

  if (!(await rateLimit(`webhook:${hashIp(getClientIp(request))}`, 60, 60))) {
    return NextResponse.json({ error: "Limite de solicitações excedido." }, { status: 429 });
  }
  const body = await readTextBody(request, 16_384);
  if (!body.ok) return NextResponse.json({ error: body.tooLarge ? "Payload muito grande." : "Corpo inválido." }, { status: body.tooLarge ? 413 : 400 });
  const rawBody = body.text;

  const signature = request.headers.get("x-webhook-signature");
  if (!signature || !verifyHmac(rawBody, signature, env.WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }
  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  const parsed = webhookSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  const sale = parsed.data;
  if (Math.abs(Date.now() / 1000 - sale.timestamp) > maxClockSkewSeconds) {
    return NextResponse.json({ error: "Webhook expirado." }, { status: 401 });
  }
  const platform = sale.platform.toLowerCase();
  const profile = await prisma.affiliateProfile.findUnique({
    where: { affiliateCode: sale.affiliateCode.toUpperCase() },
    select: { id: true, user: { select: { blockedAt: true, role: true } } },
  });
  if (!profile || profile.user.blockedAt || profile.user.role !== "AFFILIATE") return NextResponse.json({ error: "Afiliado não encontrado." }, { status: 404 });

  const saleValue = new Prisma.Decimal(sale.saleValue);
  const commissionValue = saleValue.mul(new Prisma.Decimal("0.8")).toDecimalPlaces(2);
  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const existing = await tx.sale.findUnique({
        where: { platform_externalId: { platform, externalId: sale.externalId } },
      });
      if (existing) {
        const nextStatus = sale.status === "confirmed" ? "CONFIRMED" : sale.status === "reversed" ? "REVERSED" : "PENDING";
        if (existing.affiliateId !== profile.id || !existing.saleValue.equals(saleValue)) {
          return { id: existing.id, conflict: true };
        }
        if (existing.status === nextStatus) return { id: existing.id, duplicate: true };
        if (existing.status === "REVERSED" || nextStatus === "PENDING") {
          return { id: existing.id, conflict: true };
        }

        const transition = await tx.sale.updateMany({
          where: { id: existing.id, status: existing.status },
          data: { status: nextStatus },
        });
        if (transition.count !== 1) {
          const currentSale = await tx.sale.findUnique({ where: { id: existing.id }, select: { status: true } });
          return currentSale?.status === nextStatus
            ? { id: existing.id, duplicate: true }
            : { id: existing.id, conflict: true };
        }
        if (nextStatus === "CONFIRMED") {
          await tx.affiliateProfile.update({
            where: { id: existing.affiliateId },
            data: { availableBalance: { increment: existing.commissionValue } },
          });
        } else {
          await tx.affiliateProfile.update({
            where: { id: existing.affiliateId },
            data: {
              availableBalance: existing.status === "CONFIRMED" ? { decrement: existing.commissionValue } : undefined,
              totalCommission: { decrement: existing.commissionValue },
            },
          });
        }
        await tx.auditLog.create({
          data: {
            action: `SALE_${nextStatus}`,
            entityType: "Sale",
            entityId: existing.id,
            details: { platform, externalId: sale.externalId, status: sale.status },
          },
        });
        return { id: existing.id, duplicate: false };
      }

      const status = sale.status === "confirmed" ? "CONFIRMED" : sale.status === "reversed" ? "REVERSED" : "PENDING";
      const created = await tx.sale.create({
        data: {
          affiliateId: profile.id,
          productName: sale.productName,
          saleValue,
          commissionValue,
          platform,
          externalId: sale.externalId,
          status,
        },
      });
      await tx.affiliateProfile.update({
        where: { id: profile.id },
        data: {
          totalSales: { increment: 1 },
          totalCommission: status === "REVERSED" ? undefined : { increment: commissionValue },
          availableBalance: status === "CONFIRMED" ? { increment: commissionValue } : undefined,
        },
      });
      await tx.auditLog.create({
        data: {
          action: "SALE_WEBHOOK_RECEIVED",
          entityType: "Sale",
          entityId: created.id,
          details: { platform, externalId: sale.externalId, status: sale.status },
        },
      });
      return { id: created.id, duplicate: false };
    });
    if ("conflict" in outcome && outcome.conflict) {
      return NextResponse.json({ error: "Transição de status inválida para esta venda." }, { status: 409 });
    }
    return NextResponse.json({ ok: true, saleId: outcome.id, duplicate: outcome.duplicate }, { status: outcome.duplicate ? 200 : 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Venda já processada." }, { status: 409 });
    }
    throw error;
  }
}
