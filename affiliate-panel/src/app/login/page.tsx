import { LoginButton } from "@/components/login-button";

type LoginPageProps = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  return (
    <main className="login-wrap">
      <section className="card login-card">
        <div className="brand">PokiSky Afiliados</div>
        <h1 className="page-heading" style={{ marginTop: 22 }}>Seu painel de afiliado</h1>
        <p className="subtitle">Entre com sua conta Google para gerar links e acompanhar resultados.</p>
        {error === "AccessDenied" && <p className="subtitle" role="alert">Não foi possível concluir o acesso. Verifique se sua conta está autorizada e se ainda há vaga no piloto.</p>}
        <LoginButton />
        <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>Não há cadastro por senha ou e-mail. O perfil é criado no primeiro acesso, enquanto houver uma das cinco vagas do piloto.</p>
      </section>
    </main>
  );
}
