import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { decryptPixKey } from "@/lib/crypto";
import { adminEmails } from "@/lib/env";
import { isSameOrigin, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || session.user.blocked || session.user.role !== "ADMIN" || !session.user.email || !adminEmails.has(session.user.email.toLowerCase())) {
    return jsonError("Acesso restrito.", 403);
  }
  if (!isSameOrigin(request)) return jsonError("Origem não autorizada.", 403);
  if (!(await rateLimit(`admin-pix:${session.user.id}`, 20, 3600))) return jsonError("Limite excedido.", 429);
  const { id } = await context.params;
  const payout = await prisma.payout.findUnique({
    where: { id },
    select: { id: true, amount: true, status: true, pixKeyEncrypted: true, pixKeyType: true },
  });
  if (!payout) return jsonError("Saque não encontrado.", 404);
  await audit(session.user.id, "PAYOUT_PIX_KEY_VIEWED", "Payout", id);
  return NextResponse.json({
    id: payout.id,
    amount: payout.amount.toString(),
    status: payout.status,
    pixKeyType: payout.pixKeyType,
    pixKey: decryptPixKey(payout.pixKeyEncrypted),
  }, { headers: { "Cache-Control": "no-store" } });
}
