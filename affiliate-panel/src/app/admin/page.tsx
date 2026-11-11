import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [affiliates, clicks, sales, paidPayouts, pendingPayouts] = await Promise.all([
    prisma.user.count({ where: { role: "AFFILIATE", affiliateProfile: { isNot: null } } }),
    prisma.click.count(),
    prisma.sale.count(),
    prisma.payout.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.payout.count({ where: { status: "REQUESTED" } }),
  ]);
  return <>
    <h1 className="page-heading">Administração</h1>
    <p className="subtitle">Indicadores gerais e gestão do programa de afiliados.</p>
    <section className="grid">
      <Metric label="Afiliados" value={String(affiliates)} />
      <Metric label="Cliques totais" value={String(clicks)} />
      <Metric label="Vendas registradas" value={String(sales)} />
      <Metric label="Comissões pagas" value={brl(paidPayouts._sum.amount ?? 0)} />
    </section>
    <section className="section grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      <Link className="card" href="/admin/affiliates"><h2 className="section-title">Afiliados</h2><p className="muted">Listar, consultar detalhes, bloquear ou desbloquear.</p></Link>
      <Link className="card" href="/admin/payouts"><h2 className="section-title">Saques ({pendingPayouts} aguardando)</h2><p className="muted">Revisar solicitações e registrar aprovações e pagamentos.</p></Link>
    </section>
  </>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>;
}
