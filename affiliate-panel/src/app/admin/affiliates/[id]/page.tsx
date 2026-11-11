import { notFound } from "next/navigation";
import { AffiliateBlockButton } from "@/components/affiliate-forms";
import { prisma } from "@/lib/prisma";
import { brl, dateTime, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ id: string }> };

export default async function AffiliateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id, role: "AFFILIATE" },
    select: {
      id: true,
      name: true,
      email: true,
      blockedAt: true,
      affiliateProfile: {
        select: {
          id: true,
          affiliateCode: true,
          totalClicks: true,
          totalSales: true,
          totalCommission: true,
          availableBalance: true,
          clicks: { orderBy: { createdAt: "desc" }, take: 50 },
          sales: { orderBy: { createdAt: "desc" }, take: 50 },
          payouts: {
            orderBy: { requestedAt: "desc" },
            take: 50,
            select: { id: true, amount: true, status: true, requestedAt: true, paidAt: true },
          },
        },
      },
    },
  });
  if (!user?.affiliateProfile) notFound();
  const profile = user.affiliateProfile;
  return <>
    <h1 className="page-heading">{user.name ?? "Afiliado"}</h1>
    <p className="subtitle">{user.email} · Código <span className="code">{profile.affiliateCode}</span></p>
    <section className="grid">
      <Metric label="Cliques" value={String(profile.totalClicks)} />
      <Metric label="Vendas" value={String(profile.totalSales)} />
      <Metric label="Comissão" value={brl(profile.totalCommission)} />
      <Metric label="Saldo disponível" value={brl(profile.availableBalance)} />
    </section>
    <section className="card section">
      <h2 className="section-title">Status da conta</h2>
      <AffiliateBlockButton userId={user.id} blocked={Boolean(user.blockedAt)} />
    </section>
    <section className="section">
      <h2 className="section-title">Cliques recentes</h2>
      <div className="table-wrap"><table><thead><tr><th>Data</th><th>Página</th><th>Origem</th><th>User-agent</th><th>IP (hash)</th></tr></thead><tbody>
        {profile.clicks.map((click) => <tr key={click.id}><td>{dateTime(click.createdAt)}</td><td className="code">{click.page}</td><td className="code">{click.referrer ?? "Direto"}</td><td>{click.userAgent ?? "—"}</td><td className="code">{click.ipHash.slice(0, 16)}…</td></tr>)}
      </tbody></table></div>
    </section>
    <section className="section">
      <h2 className="section-title">Vendas recentes</h2>
      <div className="table-wrap"><table><thead><tr><th>Data</th><th>Produto</th><th>Venda</th><th>Comissão</th><th>Status</th></tr></thead><tbody>
        {profile.sales.map((sale) => <tr key={sale.id}><td>{dateTime(sale.createdAt)}</td><td>{sale.productName}</td><td>{brl(sale.saleValue)}</td><td>{brl(sale.commissionValue)}</td><td>{statusLabel(sale.status)}</td></tr>)}
      </tbody></table></div>
    </section>
    <section className="section">
      <h2 className="section-title">Saques</h2>
      <div className="table-wrap"><table><thead><tr><th>Data</th><th>Valor</th><th>Status</th><th>Pago em</th></tr></thead><tbody>
        {profile.payouts.map((payout) => <tr key={payout.id}><td>{dateTime(payout.requestedAt)}</td><td>{brl(payout.amount)}</td><td>{statusLabel(payout.status)}</td><td>{payout.paidAt ? dateTime(payout.paidAt) : "—"}</td></tr>)}
      </tbody></table></div>
    </section>
  </>;
}
function Metric({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>;
}
