import assert from "node:assert/strict";
import test from "node:test";
import { affiliateStatusSchema, pixInputSchema, payoutInputSchema, webhookSchema } from "../src/lib/validation.ts";

test("PIX validation rejects invalid CPF and accepts a valid CPF", () => {
  assert.equal(pixInputSchema.safeParse({ pixKeyType: "CPF", pixKey: "529.982.247-25" }).success, true);
  assert.equal(pixInputSchema.safeParse({ pixKeyType: "CPF", pixKey: "111.111.111-11" }).success, false);
  assert.equal(pixInputSchema.safeParse({ pixKeyType: "CPF", pixKey: "529a98224725" }).success, false);
  assert.equal(pixInputSchema.safeParse({ pixKeyType: "RANDOM", pixKey: "not-a-random-key" }).success, false);
});

test("payout amount accepts BRL cents but rejects out-of-range precision and negative values", () => {
  assert.equal(payoutInputSchema.safeParse({ amount: "50.25" }).success, true);
  assert.equal(payoutInputSchema.safeParse({ amount: "50.255" }).success, false);
  assert.equal(payoutInputSchema.safeParse({ amount: "-50" }).success, false);
  assert.equal(payoutInputSchema.safeParse({ amount: "50", unexpected: true }).success, false);
});

test("webhook payload requires positive sale value and strict fields", () => {
  const base = {
    platform: "hotmart",
    externalId: "order-1",
    affiliateCode: "A1B2C3D4",
    productName: "Produto",
    saleValue: "100.00",
    timestamp: 1790000000,
  };
  assert.equal(webhookSchema.safeParse(base).success, true);
  assert.equal(webhookSchema.safeParse({ ...base, saleValue: "0" }).success, false);
  assert.equal(webhookSchema.safeParse({ ...base, extra: "unexpected" }).success, false);
});

test("affiliate status updates reject arbitrary fields", () => {
  assert.equal(affiliateStatusSchema.safeParse({ blocked: true }).success, true);
  assert.equal(affiliateStatusSchema.safeParse({ blocked: true, role: "ADMIN" }).success, false);
});
