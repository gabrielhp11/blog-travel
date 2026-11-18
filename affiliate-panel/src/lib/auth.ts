import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { adminEmails } from "@/lib/env";
import { createAffiliateProfile, hasAvailableAffiliateSlot } from "@/lib/affiliate-capacity";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-authjs.session-token" : "authjs.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email || !profile || !("email_verified" in profile) || profile.email_verified !== true) return false;
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        select: { blockedAt: true, affiliateProfile: { select: { id: true } } },
      });
      if (existing?.blockedAt) return false;
      if (
        !adminEmails.has(user.email.toLowerCase()) &&
        !existing?.affiliateProfile &&
        !(await hasAvailableAffiliateSlot())
      ) return false;
      return true;
    },
    async session({ session, user }) {
      const email = user.email?.toLowerCase() ?? "";
      const role = adminEmails.has(email) ? "ADMIN" : "AFFILIATE";
      const current = await prisma.user.findUnique({ where: { id: user.id }, select: { blockedAt: true, role: true } });
      if (current && role !== current.role) await prisma.user.update({ where: { id: user.id }, data: { role } });
      if (session.user) {
        session.user.id = user.id;
        session.user.role = role;
        session.user.blocked = !current || Boolean(current.blockedAt);
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const userId = user.id;
      if (!userId) throw new Error("Cannot create an affiliate profile without a user ID.");
      const profile = await prisma.$transaction(async (tx) => {
        const isAdmin = Boolean(user.email && adminEmails.has(user.email.toLowerCase()));
        if (isAdmin) {
          await tx.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
        }
        const createdProfile = await createAffiliateProfile(tx, userId, !isAdmin);
        if (!createdProfile) {
          await tx.user.delete({ where: { id: userId } });
          return null;
        }
        return createdProfile;
      });
      if (!profile) throw new Error("The affiliate program has reached its five-account pilot limit.");
    },
  },
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
});
