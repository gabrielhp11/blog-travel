import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { brl, dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AffiliatesPage() {
  const users = await prisma.user.findMany({
    where: { role: "AFFILIATE", affiliateProfile: { isNot: null } },
    select: {
      id: true,
      name: true,
      email: true,
      blockedAt: true,
      createdAt: true,
      affiliateProfile: {
        select: { affiliateCode: true, totalClicks: true, totalSales: true, availableBalance: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return <>
    <h1 className="page-heading">Afiliados</h1>
    <p className="subtitle">Até 500 perfis mais recentes. Consulte o perfil para ver métricas e atividades.</p>
    <div className="table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Código</th><th>Cliques</th><th>Vendas</th><th>Saldo</th><th>Status</th><th>Cadastro</th></tr></thead>
      <tbody>{users.map((user) => {
        const profile = user.affiliateProfile!;
        return <tr key={user.id}><td><Link className="text-link" href={`/admin/affiliates/${encodeURIComponent(user.id)}`}>{user.name ?? "—"}</Link></td><td>{user.email}</td><td className="code">{profile.affiliateCode}</td><td>{profile.totalClicks}</td><td>{profile.totalSales}</td><td>{brl(profile.availableBalance)}</td><td><span className="badge">{user.blockedAt ? "Bloqueado" : "Ativo"}</span></td><td>{dateTime(user.createdAt)}</td></tr>;
      })}</tbody></table></div>
  </>;
}
