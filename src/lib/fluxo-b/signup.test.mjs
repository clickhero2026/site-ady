// Rodar: node --test src/lib/fluxo-b/*.test.mjs
// Contrato final do dev (06/11/2026) + respostas reais observadas na hmg.
import assert from "node:assert/strict";
import { test } from "node:test";
import { chavesDoCorpo, parseSignupResponse, SignupContratoError } from "./signupResposta.ts";

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

test("hotfix: link em redirectUrl (camelCase) também é aceito", () => {
  assert.deepEqual(parseSignupResponse(201, { redirectUrl: "https://api.test/auth?t=x" }), { ok: true, redirectUrl: "https://api.test/auth?t=x" });
  assert.deepEqual(parseSignupResponse(200, { redirectUrl: "  https://api.test/y  " }), { ok: true, redirectUrl: "https://api.test/y" });
});

test("ordem: redirect_url vence redirectUrl; vazio cai para o próximo", () => {
  assert.deepEqual(parseSignupResponse(200, { redirect_url: "https://a.test", redirectUrl: "https://b.test" }), { ok: true, redirectUrl: "https://a.test" });
  assert.deepEqual(parseSignupResponse(200, { redirect_url: "  ", redirectUrl: "https://b.test" }), { ok: true, redirectUrl: "https://b.test" });
  assert.deepEqual(parseSignupResponse(200, { redirect_url: 123, redirectUrl: "https://b.test" }), { ok: true, redirectUrl: "https://b.test" });
});

test("loginUrl continua ignorado", () => {
  assert.deepEqual(parseSignupResponse(200, { loginUrl: "https://x.test" }), { ok: true, redirectUrl: null });
});

test("diagnóstico: só nomes das chaves, nunca valores", () => {
  const corpo = { message: "Se for possível…", token: "eyJhbGciOi.segredo.assinatura", data: { url: "https://api.test/?t=segredo" } };
  const log = chavesDoCorpo(corpo);
  assert.equal(log, "message, token, data");
  assert.doesNotMatch(log, /segredo|eyJ|https/);
  assert.equal(chavesDoCorpo({}), "(nenhuma)");
  assert.equal(chavesDoCorpo(null), "(vazio)");
  assert.equal(chavesDoCorpo([1, 2]), "(array)");
  assert.equal(chavesDoCorpo("texto"), "(string)");
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
