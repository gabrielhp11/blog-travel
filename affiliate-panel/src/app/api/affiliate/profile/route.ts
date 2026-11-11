import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { encryptPixKey, maskPixKey } from "@/lib/crypto";
import { isSameOrigin, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { pixInputSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-body";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.blocked || session.user.role !== "AFFILIATE") return jsonError("Não autenticado.", 401);
  const profile = await prisma.affiliateProfile.findUnique({
    where: { userId: session.user.id },
    select: { pixKeyEncrypted: true, pixKeyType: true },
  });
  return NextResponse.json({
    pixKey: profile?.pixKeyEncrypted ? "••••" : null,
    pixKeyType: profile?.pixKeyType ?? null,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.blocked || session.user.role !== "AFFILIATE") return jsonError("Não autenticado.", 401);
  if (!isSameOrigin(request)) return jsonError("Origem não autorizada.", 403);
  if (!(await rateLimit(`profile:${session.user.id}`, 10, 3600))) return jsonError("Limite de solicitações excedido.", 429);

  const rawBody = await readJsonBody(request, 2048);
  if (!rawBody.ok) return jsonError(rawBody.tooLarge ? "Payload muito grande." : "JSON inválido.", rawBody.tooLarge ? 413 : 400);
  const parsed = pixInputSchema.safeParse(rawBody.value);
  if (!parsed.success) return jsonError("Dados da chave PIX inválidos.", 400);
  const normalized = parsed.data.pixKeyType === "CPF" || parsed.data.pixKeyType === "PHONE"
    ? parsed.data.pixKey.replace(/\D/g, "")
    : parsed.data.pixKey.trim().toLowerCase();
  const updated = await prisma.$transaction(async (tx) => {
    const profile = await tx.affiliateProfile.update({
      where: { userId: session.user.id },
      data: { pixKeyEncrypted: encryptPixKey(normalized), pixKeyType: parsed.data.pixKeyType },
      select: { id: true },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "PIX_KEY_UPDATED",
        entityType: "AffiliateProfile",
        entityId: profile.id,
        details: { pixKeyType: parsed.data.pixKeyType },
      },
    });
    return profile;
  });
  return NextResponse.json({ ok: true, pixKey: maskPixKey(normalized), pixKeyType: parsed.data.pixKeyType });
}
