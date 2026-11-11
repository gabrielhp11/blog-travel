import Link from "next/link";
import { signOut } from "@/lib/auth";

export function AppNav({ name, admin = false }: { name: string | null; admin?: boolean }) {
  return (
    <header className="topbar">
      <Link className="brand" href="/dashboard">PokiSky Afiliados</Link>
      <nav className="nav" aria-label="Navegação principal">
        <Link href="/dashboard">Visão geral</Link>
        <Link href="/dashboard/clicks">Cliques</Link>
        <Link href="/dashboard/sales">Vendas</Link>
        <Link href="/dashboard/payouts">Saques</Link>
        {admin && <Link href="/admin">Admin</Link>}
        <span className="user-chip">{name ?? "Afiliado"}</span>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
          <button className="button-secondary" type="submit">Sair</button>
        </form>
      </nav>
    </header>
  );
}
