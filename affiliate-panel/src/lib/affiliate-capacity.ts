import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAffiliateCode } from "@/lib/codes";
import { reserveAffiliateSlot } from "@/lib/affiliate-slots";

export async function hasAvailableAffiliateSlot(): Promise<boolean> {
  return (await prisma.affiliateSlot.count({ where: { userId: null } })) > 0;
}

export async function createAffiliateProfile(
  tx: Prisma.TransactionClient,
  userId: string,
  isAffiliate: boolean,
) {
  if (isAffiliate && !(await reserveAffiliateSlot(tx, userId))) return null;

  return tx.affiliateProfile.create({
    data: { userId, affiliateCode: await createAffiliateCode() },
  });
}
