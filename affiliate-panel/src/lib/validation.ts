import { z } from "zod";

export const pixTypeSchema = z.enum(["CPF", "EMAIL", "PHONE", "RANDOM"]);
const digits = (value: string) => value.replace(/\D/g, "");

function validCpf(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) return false;
  const cpf = digits(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (length: number) => {
    const sum = cpf.slice(0, length).split("").reduce((total, char, index) => total + Number(char) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

const pixKeySchema = z.string().trim().min(1).max(120);
export const pixInputSchema = z.object({
  pixKeyType: pixTypeSchema,
  pixKey: pixKeySchema,
}).strict().superRefine(({ pixKeyType, pixKey }, context) => {
  if (pixKeyType === "CPF" && !validCpf(pixKey)) {
    context.addIssue({ code: "custom", path: ["pixKey"], message: "Informe um CPF válido." });
  }
  if (pixKeyType === "EMAIL" && !z.email().safeParse(pixKey).success) {
    context.addIssue({ code: "custom", path: ["pixKey"], message: "Informe um e-mail válido." });
  }
  if (pixKeyType === "PHONE" && (!/^[+\d()\-\s.]+$/.test(pixKey) || !/^\d{10,13}$/.test(digits(pixKey)))) {
    context.addIssue({ code: "custom", path: ["pixKey"], message: "Informe um telefone com DDD." });
  }
  if (pixKeyType === "RANDOM" && !/^(?:[0-9a-f]{32}|[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})$/i.test(pixKey)) {
    context.addIssue({ code: "custom", path: ["pixKey"], message: "Informe uma chave aleatória válida." });
  }
});

export const payoutInputSchema = z.object({
  amount: z.string().regex(/^\d{1,8}(?:\.\d{1,2})?$/).transform(Number)
    .pipe(z.number().finite().positive().max(1000000)),
}).strict();

export const webhookSchema = z.object({
  platform: z.string().trim().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  externalId: z.string().trim().min(1).max(191),
  affiliateCode: z.string().trim().min(4).max(32).regex(/^[A-Z0-9_-]+$/i),
  productName: z.string().trim().min(1).max(200),
  saleValue: z.string().regex(/^(0|[1-9]\d{0,8})(\.\d{1,2})?$/).refine((value) => Number(value) > 0),
  status: z.enum(["pending", "confirmed", "reversed"]).default("pending"),
  timestamp: z.number().int().positive(),
}).strict();

export const adminPayoutSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PAID"]),
  adminNote: z.string().trim().max(500).optional(),
}).strict();

export const affiliateStatusSchema = z.object({ blocked: z.boolean() }).strict();
