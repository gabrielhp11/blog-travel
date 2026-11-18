import type { Prisma } from "@prisma/client";

export const MAX_AFFILIATES = 5;

export async function reserveAffiliateSlot(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<boolean> {
  const availableSlots = await tx.affiliateSlot.findMany({
    where: { userId: null },
    select: { slot: true },
    orderBy: { slot: "asc" },
  });
  for (const { slot } of availableSlots) {
    const claim = await tx.affiliateSlot.updateMany({
      where: { slot, userId: null },
      data: { userId },
    });
    if (claim.count === 1) return true;
  }
  return false;
}
