import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

function encryptionKey(): Buffer {
  const key = Buffer.from(env.PII_ENCRYPTION_KEY, "base64");
  if (key.length !== 32) throw new Error("PII_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return key;
}

export function hashIp(ip: string): string {
  return createHmac("sha256", env.IP_HASH_SECRET).update(ip).digest("hex");
}

export function encryptPixKey(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptPixKey(value: string): string {
  const [iv, tag, encrypted] = value.split(".");
  if (!iv || !tag || !encrypted) throw new Error("Invalid encrypted PIX key.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8");
}

export function maskPixKey(value: string): string {
  const trimmed = value.trim();
  return `${"*".repeat(Math.max(4, trimmed.length - 4))}${trimmed.slice(-4)}`;
}

export function verifyHmac(payload: string, signature: string, secret: string): boolean {
  const supplied = Buffer.from(signature.replace(/^sha256=/i, ""), "hex");
  const expected = createHmac("sha256", secret).update(payload).digest();
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
