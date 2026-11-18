import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { hashIp } from "@/lib/crypto";
import { getClientIp, validBlogOrigin } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-body";

const trackingSchema = z.object({
  code: z.string().trim().min(4).max(32).regex(/^[A-Z0-9_-]+$/i),
  page: z.string().trim().min(1).max(2048),
}).strict();

export async function OPTIONS(request: NextRequest) {
  if (!validBlogOrigin(request)) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": env.BLOG_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!validBlogOrigin(request)) return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  if (!(await rateLimit(`track:${hashIp(getClientIp(request))}`, 30, 60))) {
    return NextResponse.json({ error: "Limite de solicitações excedido." }, { status: 429 });
  }

  const rawBody = await readJsonBody(request, 4096);
  if (!rawBody.ok) return NextResponse.json({ error: rawBody.tooLarge ? "Payload muito grande." : "JSON inválido." }, { status: rawBody.tooLarge ? 413 : 400 });
  const body = trackingSchema.safeParse(rawBody.value);
  if (!body.success) return NextResponse.json({ error: "Dados de tracking inválidos." }, { status: 400 });
  const { code, page } = body.data;
  const profile = await prisma.affiliateProfile.findUnique({
    where: { affiliateCode: code.toUpperCase() },
    select: { id: true, user: { select: { blockedAt: true, role: true } } },
  });
  if (!profile || profile.user.blockedAt || profile.user.role !== "AFFILIATE") return NextResponse.json({ error: "Código inválido." }, { status: 404 });

  let safePage: string | null = null;
  if (page.startsWith("/") && !page.startsWith("//") && !page.includes("\\")) {
    try {
      const parsedPage = new URL(page, env.BLOG_ORIGIN);
      if (parsedPage.origin === env.BLOG_ORIGIN) safePage = parsedPage.pathname;
    } catch {
      safePage = null;
    }
  }
  if (!safePage) return NextResponse.json({ error: "Página inválida." }, { status: 400 });
  let safeReferrer: string | null = null;
  const referrerHeader = request.headers.get("referer");
  if (referrerHeader) {
    try {
      const parsedReferrer = new URL(referrerHeader);
      safeReferrer = `${parsedReferrer.origin}${parsedReferrer.pathname}`.slice(0, 2048);
    } catch {
      safeReferrer = null;
    }
  }
  await prisma.$transaction([
    prisma.click.create({
      data: {
        affiliateId: profile.id,
        page: safePage.slice(0, 2048),
        ipHash: hashIp(getClientIp(request)),
        userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
        referrer: safeReferrer,
      },
    }),
    prisma.affiliateProfile.update({ where: { id: profile.id }, data: { totalClicks: { increment: 1 } } }),
  ]);
  return NextResponse.json({ ok: true }, {
    headers: {
      "Access-Control-Allow-Origin": env.BLOG_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      Vary: "Origin",
    },
  });
}
