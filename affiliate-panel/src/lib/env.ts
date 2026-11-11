import { z } from "zod";

const optionalUrl = z.preprocess((value) => value === "" ? undefined : value, z.string().url().optional());
const origin = z.string().url().refine((value) => {
  const parsed = new URL(value);
  return parsed.origin === value;
}, "Use uma origem sem caminho, query ou barra final.");
const adminList = z.string().default("").refine((value) =>
  value.split(",").map((email) => email.trim()).filter(Boolean).every((email) => z.email().safeParse(email).success),
"ADMIN_EMAILS deve conter endereços de e-mail separados por vírgula.");

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  BLOG_ORIGIN: origin,
  APP_ORIGIN: origin,
  ADMIN_EMAILS: adminList,
  IP_HASH_SECRET: z.string().min(32),
  PII_ENCRYPTION_KEY: z.string().refine((value) => Buffer.from(value, "base64").length === 32, "PII_ENCRYPTION_KEY deve ser base64 de 32 bytes."),
  WEBHOOK_SECRET: z.string().min(32),
  WEBHOOK_ALLOWED_ORIGINS: z.string().default("").refine((value) =>
    value.split(",").map((item) => item.trim()).filter(Boolean).every((item) => origin.safeParse(item).success),
  "WEBHOOK_ALLOWED_ORIGINS deve conter origens separadas por vírgula."),
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  MINIMUM_PAYOUT_BRL: z.coerce.number().finite().positive().default(50),
  ATTRIBUTION_MODEL: z.enum(["first", "last"]).default("first"),
});

export const env = envSchema.parse(process.env);
export const adminEmails = new Set(
  env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
);

if (process.env.NODE_ENV === "production" && (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN)) {
  throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production.");
}
