// Rodar: node --test src/lib/fluxo-b/*.test.mjs
// Casos = respostas reais da rota de homologação (06/11/2026).
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSignupResponse, SignupContratoError } from "./signupResposta.ts";

test("202 sem token/URL → sucesso sem login automático", () => {
  const r = parseSignupResponse(202, { message: "Se for possível, enviaremos um link de acesso." });
  assert.deepEqual(r, { ok: true, redirectUrl: null });
});

test("e-mail repetido também volta 202 (anti-enumeração) → mesmo resultado", () => {
  assert.deepEqual(parseSignupResponse(202, { message: "Se for possível, enviaremos um link de acesso." }), { ok: true, redirectUrl: null });
});

test("conta nova com loginUrl (contrato) → ok com o link", () => {
  const r = parseSignupResponse(201, { loginUrl: "https://api.test/auth/link?t=abc" });
  assert.deepEqual(r, { ok: true, redirectUrl: "https://api.test/auth/link?t=abc" });
});

test("EMAIL_JA_CADASTRADO → EMAIL_EXISTS em qualquer status (código vem antes)", () => {
  const corpo = { success: false, error: { code: "EMAIL_JA_CADASTRADO", message: "x" } };
  for (const status of [409, 400, 422, 200, 202, 403]) {
    assert.deepEqual(parseSignupResponse(status, corpo), { ok: false, code: "EMAIL_EXISTS" }, String(status));
  }
});

test("VALIDATION_ERROR → INVALID mesmo com status diferente de 400", () => {
  const corpo = { success: false, error: { code: "VALIDATION_ERROR" } };
  assert.deepEqual(parseSignupResponse(409, corpo), { ok: false, code: "INVALID" });
});

test("se o app passar a mandar redirectUrl/loginUrl, é usado", () => {
  assert.deepEqual(parseSignupResponse(200, { redirectUrl: "https://app.test/x" }), { ok: true, redirectUrl: "https://app.test/x" });
  assert.deepEqual(parseSignupResponse(201, { loginUrl: "https://app.test/y" }), { ok: true, redirectUrl: "https://app.test/y" });
});

test("400 VALIDATION_ERROR → INVALID", () => {
  const corpo = { success: false, error: { code: "VALIDATION_ERROR", message: "Validation failed", details: { errors: [] } } };
  assert.deepEqual(parseSignupResponse(400, corpo), { ok: false, code: "INVALID" });
  assert.deepEqual(parseSignupResponse(422, null), { ok: false, code: "INVALID" });
});

test("409 → EMAIL_EXISTS; 429 e 5xx → NETWORK", () => {
  assert.deepEqual(parseSignupResponse(409, {}), { ok: false, code: "EMAIL_EXISTS" });
  assert.deepEqual(parseSignupResponse(429, {}), { ok: false, code: "NETWORK" });
  assert.deepEqual(parseSignupResponse(503, null), { ok: false, code: "NETWORK" });
});

test("status fora do contrato → SignupContratoError", () => {
  assert.throws(() => parseSignupResponse(404, { error: { code: "NOT_FOUND" } }), SignupContratoError);
  assert.throws(() => parseSignupResponse(401, null), SignupContratoError);
});
