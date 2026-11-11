import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_AFFILIATES, reserveAffiliateSlot } from "../src/lib/affiliate-slots.ts";

test("concurrent registrations cannot reserve more than the five pilot slots", async () => {
  const assigned = new Map();
  const slots = Array.from({ length: MAX_AFFILIATES }, (_, index) => index + 1);
  const tx = {
    affiliateSlot: {
      async findMany() {
        return slots.filter((slot) => !assigned.has(slot)).map((slot) => ({ slot }));
      },
      async updateMany({ where, data }) {
        if (assigned.has(where.slot)) return { count: 0 };
        assigned.set(where.slot, data.userId);
        return { count: 1 };
      },
    },
  };

  const results = await Promise.all(
    Array.from({ length: MAX_AFFILIATES + 2 }, (_, index) =>
      reserveAffiliateSlot(tx, `affiliate-${index}`),
    ),
  );

  assert.equal(results.filter(Boolean).length, MAX_AFFILIATES);
  assert.equal(assigned.size, MAX_AFFILIATES);
  assert.equal(new Set(assigned.values()).size, MAX_AFFILIATES);
});
