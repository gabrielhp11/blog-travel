import { AppNav } from "@/components/app-nav";
import { requireAdmin } from "@/lib/authz";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = await requireAdmin();
  return <div className="shell"><AppNav name={user.name} admin />{children}</div>;
}
