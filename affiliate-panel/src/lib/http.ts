import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function isSameOrigin(request: NextRequest): boolean {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export function getClientIp(request: NextRequest): string {
  return request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
}

export function validBlogOrigin(request: NextRequest): boolean {
  return request.headers.get("origin") === env.BLOG_ORIGIN;
}

export function safeBlogPath(value: string | null): string | null {
  if (value === null) return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const parsed = new URL(value, env.BLOG_ORIGIN);
    if (parsed.origin !== env.BLOG_ORIGIN) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`.slice(0, 2048);
  } catch {
    return null;
  }
}
