import { LoginButton } from "@/components/login-button";

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <section className="card login-card">
        <div className="brand">PokiSky Afiliados</div>
        <h1 className="page-heading" style={{ marginTop: 22 }}>Seu painel de afiliado</h1>
        <p className="subtitle">Entre com sua conta Google para gerar links e acompanhar resultados.</p>
        <LoginButton />
        <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>Não há cadastro por senha ou e-mail. O perfil é criado no primeiro acesso.</p>
      </section>
    </main>
  );
}
