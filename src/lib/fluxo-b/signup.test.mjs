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
