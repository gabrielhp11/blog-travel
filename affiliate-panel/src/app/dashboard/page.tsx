import Link from "next/link";
import { LinkGenerator, PixForm, PayoutForm } from "@/components/affiliate-forms";
import { env } from "@/lib/env";
import { requireAffiliate } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { brl, dateTime, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, profile } = await requireAffiliate();
  const [clicks, sales, payouts] = await Promise.all([
    prisma.click.count({ where: { affiliateId: profile.id } }),
    prisma.sale.findMany({ where: { affiliateId: profile.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.payout.findMany({
      where: { affiliateId: profile.id },
      orderBy: { requestedAt: "desc" },
      take: 5,
      select: { id: true, amount: true, status: true, requestedAt: true, paidAt: true },
    }),
  ]);
  const pixKey = profile.pixKeyEncrypted ? "cadastrada" : null;

  return <>
    <h1 className="page-heading">Olá, {user.name?.split(" ")[0] ?? "afiliado"}!</h1>
    <p className="subtitle">Acompanhe seu desempenho e compartilhe seus links exclusivos.</p>
    <section className="grid" aria-label="Resumo">
      <Metric label="Total de cliques" value={String(clicks)} />
      <Metric label="Vendas registradas" value={String(profile.totalSales)} />
      <Metric label="Comissão gerada" value={brl(profile.totalCommission)} />
      <Metric label="Disponível para saque" value={brl(profile.availableBalance)} />
    </section>

    <section className="card section">
      <h2 className="section-title">Seus links de afiliado</h2>
      <LinkGenerator affiliateCode={profile.affiliateCode} appOrigin={env.APP_ORIGIN} blogOrigin={env.BLOG_ORIGIN} />
    </section>

    <section className="card section">
      <h2 className="section-title">Sua chave PIX</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>A chave é armazenada criptografada e só é revelada a administradores autorizados durante o processamento do saque.</p>
      <PixForm initial={{ pixKeyType: profile.pixKeyType, pixKey }} />
    </section>

    <section className="card section">
      <h2 className="section-title">Solicitar saque</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>Mínimo: {brl(env.MINIMUM_PAYOUT_BRL)}. O saldo solicitado fica reservado até aprovação ou rejeição.</p>
      <PayoutForm minimum={env.MINIMUM_PAYOUT_BRL} balance={Number(profile.availableBalance)} />
    </section>

    <section className="section">
      <div className="link-row">
        <h2 className="section-title">Vendas recentes</h2><Link className="text-link" href="/dashboard/sales">Ver histórico completo</Link>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Data</th><th>Produto</th><th>Valor</th><th>Comissão</th><th>Status</th></tr></thead>
        <tbody>{sales.length ? sales.map((sale) => <tr key={sale.id}><td>{dateTime(sale.createdAt)}</td><td>{sale.productName}</td><td>{brl(sale.saleValue)}</td><td>{brl(sale.commissionValue)}</td><td><span className="badge">{statusLabel(sale.status)}</span></td></tr>) : <Empty colSpan={5} text="Nenhuma venda registrada." />}</tbody></table></div>
    </section>
    <section className="section">
      <h2 className="section-title">Saques recentes</h2>
      <p className="muted" style={{ fontSize: 13 }}><Link className="text-link" href="/dashboard/payouts">Ver histórico completo</Link></p>
      <div className="table-wrap"><table><thead><tr><th>Solicitado</th><th>Valor</th><th>Status</th><th>Pago em</th></tr></thead>
        <tbody>{payouts.length ? payouts.map((payout) => <tr key={payout.id}><td>{dateTime(payout.requestedAt)}</td><td>{brl(payout.amount)}</td><td><span className="badge">{statusLabel(payout.status)}</span></td><td>{payout.paidAt ? dateTime(payout.paidAt) : "—"}</td></tr>) : <Empty colSpan={4} text="Nenhum saque solicitado." />}</tbody></table></div>
    </section>
  </>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>;
}
function Empty({ colSpan, text }: { colSpan: number; text: string }) {
  return <tr><td className="muted" colSpan={colSpan}>{text}</td></tr>;
}
