"use client";

import { useState, type FormEvent } from "react";

type PixInfo = { pixKeyType: string | null; pixKey: string | null };

export function PixForm({ initial }: { initial: PixInfo }) {
  const [pixKeyType, setPixKeyType] = useState(initial.pixKeyType ?? "CPF");
  const [pixKey, setPixKey] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixKeyType, pixKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Não foi possível salvar a chave.");
      setPixKey("");
      setMessage(`Chave salva: ${result.pixKey}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar a chave.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-row" onSubmit={submit}>
      <div className="field">
        <label htmlFor="pix-type">Tipo da chave</label>
        <select id="pix-type" value={pixKeyType} onChange={(event) => setPixKeyType(event.target.value)}>
          <option value="CPF">CPF</option><option value="EMAIL">E-mail</option><option value="PHONE">Telefone</option><option value="RANDOM">Aleatória</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="pix-key">Chave PIX {initial.pixKey ? `(atual: ${initial.pixKey})` : ""}</label>
        <input id="pix-key" value={pixKey} onChange={(event) => setPixKey(event.target.value)} autoComplete="off" maxLength={120} required />
      </div>
      <button className="button" disabled={busy} type="submit">{busy ? "Salvando..." : "Salvar chave"}</button>
      {message && <p className="feedback" role="status">{message}</p>}
    </form>
  );
}

export function PayoutForm({ minimum, balance }: { minimum: number; balance: number }) {
  const [amount, setAmount] = useState(String(minimum.toFixed(2)));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Não foi possível solicitar o saque.");
      setMessage("Solicitação registrada. O saldo foi reservado até a análise.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível solicitar o saque.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-row" onSubmit={submit}>
      <div className="field">
        <label htmlFor="payout-amount">Valor (R$)</label>
        <input id="payout-amount" type="number" min={minimum} max={balance} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
      </div>
      <button className="button" disabled={busy || balance < minimum} type="submit">{busy ? "Enviando..." : "Solicitar PIX"}</button>
      {message && <p className="feedback" role="status">{message}</p>}
    </form>
  );
}

export function LinkGenerator({ affiliateCode, blogOrigin, appOrigin }: { affiliateCode: string; blogOrigin: string; appOrigin: string }) {
  const [path, setPath] = useState("/");
  const [copied, setCopied] = useState(false);
  const validPath = path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
  const encoded = encodeURIComponent(validPath ? path : "/");
  const shortLink = `${appOrigin}/r/${encodeURIComponent(affiliateCode)}?path=${encoded}`;
  const directLink = new URL(validPath ? path : "/", blogOrigin);
  directLink.searchParams.set("ref", affiliateCode);
  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="stack">
      <div className="link-row">
        <div><div className="metric-label">Link curto (registra antes do redirecionamento)</div><div className="code">{shortLink}</div></div>
        <button className="button-secondary" type="button" onClick={() => copy(shortLink)}>Copiar</button>
      </div>
      <div className="field">
        <label htmlFor="target-path">Página específica do blog (caminho relativo)</label>
        <input id="target-path" value={path} onChange={(event) => setPath(event.target.value)} placeholder="/topics/wellness/..." maxLength={2048} />
      </div>
      <div className="link-row">
        <div><div className="metric-label">Link direto para a página</div><div className="code">{directLink.toString()}</div></div>
        <button className="button-secondary" type="button" onClick={() => copy(directLink.toString())}>Copiar</button>
      </div>
      {copied && <span className="feedback" role="status">Link copiado.</span>}
      <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
        Atribuição por 30 dias. Links curtos registram o clique no painel. Para rastrear links diretos com <code>?ref=</code>, inclua o script de integração documentado no README.
      </p>
    </div>
  );
}

export function AdminPayoutActions({ id, status }: { id: string; status: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [showPix, setShowPix] = useState(false);
  async function revealPix() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/payouts/${encodeURIComponent(id)}/pix`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Não foi possível consultar a chave.");
      setPixKey(`${result.pixKeyType}: ${result.pixKey}`);
      setShowPix(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível consultar a chave.");
    } finally {
      setBusy(false);
    }
  }
  async function update(nextStatus: "APPROVED" | "REJECTED" | "PAID") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/payouts/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Falha ao atualizar.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao atualizar.");
      setBusy(false);
    }
  }
  const canApprove = status === "REQUESTED";
  const canPay = status === "APPROVED";
  return <div className="stack">
    <div className="actions"><button className="button-secondary" disabled={busy} onClick={revealPix} type="button">{showPix ? "Atualizar chave PIX" : "Ver chave PIX"}</button></div>
    {showPix && <span className="code">{pixKey}</span>}
    <div className="actions">
    {canApprove && <><button className="button" disabled={busy} onClick={() => update("APPROVED")}>Aprovar</button><button className="button-danger" disabled={busy} onClick={() => update("REJECTED")}>Rejeitar</button></>}
    {canPay && <button className="button" disabled={busy} onClick={() => update("PAID")}>Marcar como pago</button>}
    {message && <span className="error">{message}</span>}
    </div>
  </div>;
}

export function AffiliateBlockButton({ userId, blocked }: { userId: string; blocked: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function toggle() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/affiliates/${encodeURIComponent(userId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: !blocked }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Falha ao atualizar afiliado.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao atualizar afiliado.");
      setBusy(false);
    }
  }
  return <div className="actions"><button className={blocked ? "button" : "button-danger"} disabled={busy} onClick={toggle}>{blocked ? "Desbloquear" : "Bloquear afiliado"}</button>{message && <span className="error">{message}</span>}</div>;
}
