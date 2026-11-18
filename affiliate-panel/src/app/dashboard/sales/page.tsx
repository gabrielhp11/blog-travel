import { requireAffiliate } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { brl, dateTime, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const { profile } = await requireAffiliate();
  const sales = await prisma.sale.findMany({ where: { affiliateId: profile.id }, orderBy: { createdAt: "desc" }, take: 200 });
  return <>
    <h1 className="page-heading">Histórico de vendas</h1>
    <p className="subtitle">As comissões seguem o status de confirmação informado pela plataforma de venda.</p>
    <div className="table-wrap"><table><thead><tr><th>Data</th><th>Produto</th><th>Plataforma</th><th>Venda</th><th>Comissão (80%)</th><th>Status</th></tr></thead>
      <tbody>{sales.length ? sales.map((sale) => <tr key={sale.id}><td>{dateTime(sale.createdAt)}</td><td>{sale.productName}</td><td>{sale.platform}</td><td>{brl(sale.saleValue)}</td><td>{brl(sale.commissionValue)}</td><td><span className="badge">{statusLabel(sale.status)}</span></td></tr>) : <tr><td className="muted" colSpan={6}>Nenhuma venda registrada.</td></tr>}</tbody></table></div>
  </>;
}
