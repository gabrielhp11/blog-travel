import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { adminEmails } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { createAffiliateProfile } from "@/lib/affiliate-capacity";

export async function getCurrentAffiliate() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || session.user.blocked) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { affiliateProfile: true },
  });
  if (!user || user.blockedAt) return null;

  let profile = user.affiliateProfile;
  if (!profile) {
    profile = await prisma.$transaction((tx) =>
      createAffiliateProfile(tx, user.id, user.role === "AFFILIATE"),
    );
    if (!profile) return null;
  }
  return { user, profile };
}

export async function requireAffiliate() {
  const current = await getCurrentAffiliate();
  if (!current) redirect("/login");
  if (current.user.role !== "AFFILIATE") redirect("/admin");
  return current;
}

export async function requireAdmin() {
  const current = await getCurrentAffiliate();
  if (!current) redirect("/login");
  if (current.user.role !== "ADMIN" || !current.user.email || !adminEmails.has(current.user.email.toLowerCase())) redirect("/dashboard");
  return current;
}
