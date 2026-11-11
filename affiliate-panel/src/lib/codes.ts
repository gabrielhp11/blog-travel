import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function createAffiliateCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomBytes(9).toString("base64url").toUpperCase();
    const existing = await prisma.affiliateProfile.findUnique({ where: { affiliateCode: code } });
    if (!existing) return code;
  }
  throw new Error("Unable to create a unique affiliate code.");
}
