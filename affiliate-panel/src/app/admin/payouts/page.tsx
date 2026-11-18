import { AdminPayoutActions } from "@/components/affiliate-forms";
import { prisma } from "@/lib/prisma";
import { brl, dateTime, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  const payouts = await prisma.payout.findMany({
    select: {
      id: true,
      requestedAt: true,
      amount: true,
      pixKeyType: true,
      status: true,
      affiliate: { select: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { requestedAt: "desc" },
    take: 300,
  });
  return <>
    <h1 className="page-heading">Solicitações de saque</h1>
    <p className="subtitle">Aprovar e marcar como pago são etapas distintas. Rejeitar devolve o saldo reservado ao afiliado.</p>
    <div className="table-wrap"><table><thead><tr><th>Solicitado</th><th>Afiliado</th><th>Valor</th><th>PIX</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>{payouts.map((payout) => <tr key={payout.id}><td>{dateTime(payout.requestedAt)}</td><td>{payout.affiliate.user.name}<br /><span className="muted">{payout.affiliate.user.email}</span></td><td>{brl(payout.amount)}</td><td>{payout.pixKeyType}</td><td><span className="badge">{statusLabel(payout.status)}</span></td><td><AdminPayoutActions id={payout.id} status={payout.status} /></td></tr>)}</tbody></table></div>
  </>;
}
