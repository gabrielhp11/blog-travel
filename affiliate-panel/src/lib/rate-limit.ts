import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

type WindowEntry = { count: number; resetAt: number };
const localStore = new Map<string, WindowEntry>();
const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : null;

const upstashLimits = new Map<string, Ratelimit>();

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  if (redis) {
    const identifier = `${limit}:${windowSeconds}`;
    let limiter = upstashLimits.get(identifier);
    if (!limiter) {
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(limit, `${windowSeconds} s`),
        prefix: "affiliate-rate",
      });
      upstashLimits.set(identifier, limiter);
    }
    const result = await limiter.limit(key);
    return result.success;
  }

  if (process.env.NODE_ENV === "production") throw new Error("Rate limiting is not configured.");
  const now = Date.now();
  const current = localStore.get(key);
  if (!current || current.resetAt <= now) {
    localStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
