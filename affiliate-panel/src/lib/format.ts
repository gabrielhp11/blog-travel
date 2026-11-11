export function brl(value: { toString(): string } | number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
}

export function dateTime(value: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

export function statusLabel(value: string): string {
  const labels: Record<string, string> = {
    REQUESTED: "Solicitado",
    APPROVED: "Aprovado",
    PAID: "Pago",
    REJECTED: "Rejeitado",
    PENDING: "Pendente",
    CONFIRMED: "Confirmada",
    REVERSED: "Estornada",
  };
  return labels[value] ?? value;
}
