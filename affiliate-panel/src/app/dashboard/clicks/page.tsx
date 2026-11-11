import { requireAffiliate } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClickHistoryPage() {
  const { profile } = await requireAffiliate();
  const clicks = await prisma.click.findMany({ where: { affiliateId: profile.id }, orderBy: { createdAt: "desc" }, take: 200 });
  return <>
    <h1 className="page-heading">Histórico de cliques</h1>
    <p className="subtitle">Exibimos os 200 cliques mais recentes. Endereços IP são armazenados somente como hash.</p>
    <div className="table-wrap"><table><thead><tr><th>Data e hora</th><th>Página</th><th>Origem</th><th>User-agent</th><th>IP (hash)</th></tr></thead>
      <tbody>{clicks.length ? clicks.map((click) => <tr key={click.id}><td>{dateTime(click.createdAt)}</td><td className="code">{click.page}</td><td className="code">{click.referrer ?? "Direto"}</td><td>{click.userAgent ?? "—"}</td><td className="code">{click.ipHash.slice(0, 16)}…</td></tr>) : <tr><td className="muted" colSpan={5}>Nenhum clique registrado.</td></tr>}</tbody></table></div>
  </>;
}
