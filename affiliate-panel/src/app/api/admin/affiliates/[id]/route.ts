import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { adminEmails } from "@/lib/env";
import { isSameOrigin, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-body";
import { affiliateStatusSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || session.user.blocked || session.user.role !== "ADMIN" || !session.user.email || !adminEmails.has(session.user.email.toLowerCase())) {
    return jsonError("Acesso restrito.", 403);
  }
  if (!isSameOrigin(request)) return jsonError("Origem não autorizada.", 403);
  if (!(await rateLimit(`admin-user:${session.user.id}`, 60, 3600))) return jsonError("Limite excedido.", 429);
  const rawBody = await readJsonBody(request, 256);
  if (!rawBody.ok) return jsonError(rawBody.tooLarge ? "Payload muito grande." : "JSON inválido.", rawBody.tooLarge ? 413 : 400);
  const parsed = affiliateStatusSchema.safeParse(rawBody.value);
  if (!parsed.success) return jsonError("Informe o novo estado de bloqueio.", 400);
  const { blocked } = parsed.data;
  const { id } = await context.params;
  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: { id, role: "AFFILIATE" },
      data: { blockedAt: blocked ? new Date() : null },
    });
    if (updated.count !== 1) return null;
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: blocked ? "AFFILIATE_BLOCKED" : "AFFILIATE_UNBLOCKED",
        entityType: "User",
        entityId: id,
      },
    });
    return { id, blockedAt: blocked ? new Date() : null };
  });
  if (!user) return jsonError("Afiliado não encontrado.", 404);
  return NextResponse.json({ ok: true, blocked: Boolean(user.blockedAt) });
}
