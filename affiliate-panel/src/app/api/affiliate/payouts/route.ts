import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { isSameOrigin, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { payoutInputSchema } from "@/lib/validation";
import { readJsonBody } from "@/lib/request-body";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.blocked || session.user.role !== "AFFILIATE") return jsonError("Não autenticado.", 401);
  if (!isSameOrigin(request)) return jsonError("Origem não autorizada.", 403);
  if (!(await rateLimit(`payout:${session.user.id}`, 3, 86400))) {
    return jsonError("Limite diário de solicitações excedido.", 429);
  }

  const rawBody = await readJsonBody(request, 1024);
  if (!rawBody.ok) return jsonError(rawBody.tooLarge ? "Payload muito grande." : "JSON inválido.", rawBody.tooLarge ? 413 : 400);
  const parsed = payoutInputSchema.safeParse(rawBody.value);
  if (!parsed.success) return jsonError("Valor de saque inválido.", 400);
  if (parsed.data.amount < env.MINIMUM_PAYOUT_BRL) {
    return jsonError(`O valor mínimo para saque é R$ ${env.MINIMUM_PAYOUT_BRL.toFixed(2)}.`, 400);
  }
  const amount = new Prisma.Decimal(parsed.data.amount.toFixed(2));
  const payout = await prisma.$transaction(async (tx) => {
    const profile = await tx.affiliateProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile?.pixKeyEncrypted || !profile.pixKeyType) throw new Error("PIX_KEY_REQUIRED");
    const deducted = await tx.affiliateProfile.updateMany({
      where: { id: profile.id, availableBalance: { gte: amount } },
      data: { availableBalance: { decrement: amount } },
    });
    if (deducted.count !== 1) throw new Error("INSUFFICIENT_BALANCE");
    const created = await tx.payout.create({
      data: {
        affiliateId: profile.id,
        amount,
        pixKeyEncrypted: profile.pixKeyEncrypted,
        pixKeyType: profile.pixKeyType,
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "PAYOUT_REQUESTED",
        entityType: "Payout",
        entityId: created.id,
        details: { amount: amount.toFixed(2) },
      },
    });
    return created;
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === "PIX_KEY_REQUIRED") return null;
    if (error instanceof Error && error.message === "INSUFFICIENT_BALANCE") return null;
    throw error;
  });

  if (!payout) {
    const profile = await prisma.affiliateProfile.findUnique({ where: { userId: session.user.id }, select: { pixKeyEncrypted: true } });
    return jsonError(profile?.pixKeyEncrypted ? "Saldo disponível insuficiente." : "Cadastre uma chave PIX antes de solicitar saque.", 400);
  }
  return NextResponse.json({ ok: true, payoutId: payout.id }, { status: 201 });
}
