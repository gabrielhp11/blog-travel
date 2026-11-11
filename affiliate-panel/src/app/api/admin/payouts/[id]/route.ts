import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { adminEmails } from "@/lib/env";
import { decryptPixKey, maskPixKey } from "@/lib/crypto";
import { isSameOrigin, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { adminPayoutSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-body";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || session.user.blocked || session.user.role !== "ADMIN" || !session.user.email || !adminEmails.has(session.user.email.toLowerCase())) {
    return jsonError("Acesso restrito.", 403);
  }
  if (!isSameOrigin(request)) return jsonError("Origem não autorizada.", 403);
  if (!(await rateLimit(`admin-payout:${session.user.id}`, 60, 3600))) return jsonError("Limite excedido.", 429);
  const rawBody = await readJsonBody(request, 2048);
  if (!rawBody.ok) return jsonError(rawBody.tooLarge ? "Payload muito grande." : "JSON inválido.", rawBody.tooLarge ? 413 : 400);
  const parsed = adminPayoutSchema.safeParse(rawBody.value);
  if (!parsed.success) return jsonError("Dados inválidos.", 400);
  const { id } = await context.params;

  const outcome = await prisma.$transaction(async (tx) => {
    const payout = await tx.payout.findUnique({ where: { id } });
    if (!payout) return { error: "NOT_FOUND" } as const;
    if (payout.status !== "REQUESTED" && payout.status !== "APPROVED") return { error: "INVALID_STATUS" } as const;
    const nextStatus = parsed.data.status;
    if (nextStatus === payout.status) return { error: "INVALID_STATUS" } as const;
    if (nextStatus === "PAID" && payout.status !== "APPROVED") return { error: "MUST_APPROVE_FIRST" } as const;
    if (nextStatus === "REJECTED" && payout.status !== "REQUESTED") return { error: "CANNOT_REJECT" } as const;

    const updated = await tx.payout.updateMany({
      where: { id, status: payout.status },
      data: {
        status: nextStatus,
        processedAt: new Date(),
        paidAt: nextStatus === "PAID" ? new Date() : null,
        processedById: session.user.id,
        adminNote: parsed.data.adminNote,
      },
    });
    if (updated.count !== 1) return { error: "INVALID_STATUS" } as const;
    if (nextStatus === "REJECTED") {
      await tx.affiliateProfile.update({
        where: { id: payout.affiliateId },
        data: { availableBalance: { increment: payout.amount } },
      });
    }
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: `PAYOUT_${nextStatus}`,
        entityType: "Payout",
        entityId: id,
        details: {
          amount: payout.amount.toFixed(2),
          pixKey: maskPixKey(decryptPixKey(payout.pixKeyEncrypted)),
          adminNote: parsed.data.adminNote ?? null,
        },
      },
    });
    return { status: nextStatus } as const;
  });
  if ("error" in outcome) {
    const status = outcome.error === "NOT_FOUND" ? 404 : 409;
    return NextResponse.json({ error: outcome.error }, { status });
  }
  return NextResponse.json({ ok: true, status: outcome.status });
}
