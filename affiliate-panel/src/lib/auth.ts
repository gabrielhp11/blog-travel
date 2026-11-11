import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { adminEmails } from "@/lib/env";
import { createAffiliateCode } from "@/lib/codes";

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
      const existing = await prisma.user.findUnique({ where: { email: user.email }, select: { blockedAt: true } });
      return !existing?.blockedAt;
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
      await prisma.$transaction(async (tx) => {
        if (user.email && adminEmails.has(user.email.toLowerCase())) {
          await tx.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
        }
        await tx.affiliateProfile.create({
          data: { userId: user.id, affiliateCode: await createAffiliateCode() },
        });
      });
    },
  },
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
});
