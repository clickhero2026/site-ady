// Rodar: node --test src/lib/fluxo-b/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { LINK_VALIDADE_UTIL_MS, linkExpirado } from "./regras.ts";

test("expiração: vale até 55 min, vence depois; sem horário = vencido", () => {
  const t0 = 1_800_000_000_000;
  assert.equal(LINK_VALIDADE_UTIL_MS, 55 * 60 * 1000);
  assert.equal(linkExpirado(t0, t0), false);
  assert.equal(linkExpirado(t0, t0 + 54 * 60_000), false);
  assert.equal(linkExpirado(t0, t0 + 55 * 60_000), false);
  assert.equal(linkExpirado(t0, t0 + 55 * 60_000 + 1), true);
  assert.equal(linkExpirado(t0, t0 + 60 * 60_000), true);
  assert.equal(linkExpirado(null, t0), true);
  assert.equal(linkExpirado(undefined, t0), true);
  assert.equal(linkExpirado(Number.NaN, t0), true);
});
