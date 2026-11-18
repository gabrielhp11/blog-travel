import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "AFFILIATE";
      blocked: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "AFFILIATE";
    blockedAt: Date | null;
  }
}
