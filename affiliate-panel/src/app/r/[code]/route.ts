import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { hashIp } from "@/lib/crypto";
import { getClientIp, safeBlogPath } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ code: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { code: rawCode } = await context.params;
  const code = rawCode.toUpperCase();
  if (!/^[A-Z0-9_-]{4,32}$/.test(code)) return new NextResponse("Link inválido.", { status: 404 });
  if (!(await rateLimit(`redirect:${hashIp(getClientIp(request))}`, 120, 60))) {
    return new NextResponse("Muitas solicitações. Tente novamente em instantes.", { status: 429 });
  }
  const profile = await prisma.affiliateProfile.findUnique({
    where: { affiliateCode: code },
    select: { id: true, user: { select: { blockedAt: true, role: true } } },
  });
  if (!profile || profile.user.blockedAt || profile.user.role !== "AFFILIATE") return new NextResponse("Link inválido.", { status: 404 });

  const page = safeBlogPath(request.nextUrl.searchParams.get("path"));
  if (!page) return new NextResponse("Página de destino inválida.", { status: 400 });
  const target = new URL(page, env.BLOG_ORIGIN);
  target.searchParams.set("ref", code);
  target.searchParams.set("aff_visit", "1");

  const referrerHeader = request.headers.get("referer");
  let referrer: string | null = null;
  if (referrerHeader) {
    try {
      const parsed = new URL(referrerHeader);
      referrer = `${parsed.origin}${parsed.pathname}`.slice(0, 2048);
    } catch {
      referrer = null;
    }
  }
  const userAgent = request.headers.get("user-agent")?.slice(0, 512) ?? null;
  await prisma.$transaction([
    prisma.click.create({
      data: {
        affiliateId: profile.id,
        page: target.pathname,
        ipHash: hashIp(getClientIp(request)),
        userAgent,
        referrer,
      },
    }),
    prisma.affiliateProfile.update({ where: { id: profile.id }, data: { totalClicks: { increment: 1 } } }),
  ]);
  return NextResponse.redirect(target, { status: 302, headers: { "Cache-Control": "no-store" } });
}
