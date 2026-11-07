// Rodar: node --test src/lib/fluxo-b/*.test.mjs
// Contrato final do dev (06/11/2026) + respostas reais observadas na hmg.
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSignupResponse, SignupContratoError } from "./signupResposta.ts";

test("conta nova: redirect_url → ok com o link", () => {
  const r = parseSignupResponse(201, { redirect_url: "https://api.test/auth/link?t=abc" });
  assert.deepEqual(r, { ok: true, redirectUrl: "https://api.test/auth/link?t=abc" });
  assert.deepEqual(parseSignupResponse(200, { redirect_url: "  https://api.test/x  " }), { ok: true, redirectUrl: "https://api.test/x" });
});

test("2xx sem redirect_url (hmg hoje: 202 só com message) → ok sem link", () => {
  assert.deepEqual(parseSignupResponse(202, { message: "Se for possível, enviaremos um link de acesso." }), { ok: true, redirectUrl: null });
  assert.deepEqual(parseSignupResponse(200, { redirect_url: "" }), { ok: true, redirectUrl: null });
  assert.deepEqual(parseSignupResponse(204, null), { ok: true, redirectUrl: null });
});

test("suposições antigas não valem mais: loginUrl/redirectUrl são ignorados", () => {
  assert.deepEqual(parseSignupResponse(200, { loginUrl: "https://x.test", redirectUrl: "https://y.test" }), { ok: true, redirectUrl: null });
});

test("{ erro: EMAIL_JA_CADASTRADO } → EMAIL_EXISTS em qualquer status (corpo decide)", () => {
  for (const status of [409, 400, 422, 200, 202, 403, 500]) {
    assert.deepEqual(parseSignupResponse(status, { erro: "EMAIL_JA_CADASTRADO" }), { ok: false, code: "EMAIL_EXISTS" }, String(status));
  }
});

test("error.code EMAIL_JA_CADASTRADO também é aceito", () => {
  assert.deepEqual(parseSignupResponse(409, { error: { code: "EMAIL_JA_CADASTRADO" } }), { ok: false, code: "EMAIL_EXISTS" });
});

test("VALIDATION_ERROR → INVALID (formato observado na hmg), mesmo com outro status", () => {
  const corpo = { success: false, error: { code: "VALIDATION_ERROR", message: "Validation failed", details: { errors: [] } } };
  assert.deepEqual(parseSignupResponse(400, corpo), { ok: false, code: "INVALID" });
  assert.deepEqual(parseSignupResponse(409, corpo), { ok: false, code: "INVALID" });
  assert.deepEqual(parseSignupResponse(422, null), { ok: false, code: "INVALID" });
});

test("429 → RATE_LIMIT; 5xx → NETWORK", () => {
  assert.deepEqual(parseSignupResponse(429, {}), { ok: false, code: "RATE_LIMIT" });
  assert.deepEqual(parseSignupResponse(500, null), { ok: false, code: "NETWORK" });
  assert.deepEqual(parseSignupResponse(503, { message: "x" }), { ok: false, code: "NETWORK" });
});

test("status fora do contrato (inclui 409 sem código) → SignupContratoError", () => {
  assert.throws(() => parseSignupResponse(409, {}), SignupContratoError);
  assert.throws(() => parseSignupResponse(404, { error: { code: "NOT_FOUND" } }), SignupContratoError);
  assert.throws(() => parseSignupResponse(401, null), SignupContratoError);
});
