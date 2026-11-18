import { requireAffiliate } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { brl, dateTime, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PayoutHistoryPage() {
  const { profile } = await requireAffiliate();
  const payouts = await prisma.payout.findMany({
    where: { affiliateId: profile.id },
    orderBy: { requestedAt: "desc" },
    take: 200,
    select: { id: true, amount: true, status: true, requestedAt: true, processedAt: true, paidAt: true },
  });
  return <>
    <h1 className="page-heading">Histórico de saques</h1>
    <p className="subtitle">As 200 solicitações mais recentes e seus status de processamento.</p>
    <div className="table-wrap"><table><thead><tr><th>Solicitado</th><th>Valor</th><th>Status</th><th>Processado em</th><th>Pago em</th></tr></thead>
      <tbody>{payouts.length ? payouts.map((payout) => <tr key={payout.id}><td>{dateTime(payout.requestedAt)}</td><td>{brl(payout.amount)}</td><td><span className="badge">{statusLabel(payout.status)}</span></td><td>{payout.processedAt ? dateTime(payout.processedAt) : "—"}</td><td>{payout.paidAt ? dateTime(payout.paidAt) : "—"}</td></tr>) : <tr><td className="muted" colSpan={5}>Nenhum saque solicitado.</td></tr>}</tbody></table></div>
  </>;
}
