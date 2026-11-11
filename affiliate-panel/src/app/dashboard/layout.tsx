import { AppNav } from "@/components/app-nav";
import { requireAffiliate } from "@/lib/authz";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = await requireAffiliate();
  return <div className="shell"><AppNav name={user.name} admin={user.role === "ADMIN"} />{children}</div>;
}
