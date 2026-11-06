// Rodar: node --test src/lib/fluxo-b/regras.test.mjs (Node ≥ 22.18, que
// remove os tipos do .ts sozinho).
import assert from "node:assert/strict";
import { test } from "node:test";
import { bloqueadoNoHostPrincipal, resolverMock, SIGNUP_URL_HMG, SIGNUP_URL_PRODUCAO, urlDoSignup } from "./regras.ts";

test("mock ligado fora de produção", () => {
  assert.deepEqual(resolverMock({ mock: "1", vercelEnv: "preview" }), { ativo: true, ignorado: false });
  assert.deepEqual(resolverMock({ mock: "1", vercelEnv: "development" }), { ativo: true, ignorado: false });
  assert.deepEqual(resolverMock({ mock: "1" }), { ativo: true, ignorado: false }); // local, sem Vercel
});

test("mock é ignorado (com aviso) em produção", () => {
  assert.deepEqual(resolverMock({ mock: "1", vercelEnv: "production" }), { ativo: false, ignorado: true });
});

test("sem a flag, nada de mock nem aviso", () => {
  for (const vercelEnv of [undefined, "preview", "production"]) {
    assert.deepEqual(resolverMock({ mock: undefined, vercelEnv }), { ativo: false, ignorado: false });
    assert.deepEqual(resolverMock({ mock: "0", vercelEnv }), { ativo: false, ignorado: false });
  }
});

test("/fluxo-b no host principal: 404 só em produção", () => {
  for (const p of ["/fluxo-b", "/fluxo-b/criando", "/fluxo-b/senha", "/api/fluxo-b/signup"]) {
    assert.equal(bloqueadoNoHostPrincipal(p, "production"), true, p);
    assert.equal(bloqueadoNoHostPrincipal(p, "preview"), false, p);
    assert.equal(bloqueadoNoHostPrincipal(p, undefined), false, p);
  }
});

test("bloqueio não pega outras rotas do site", () => {
  for (const p of ["/", "/obrigado", "/fluxo-bx", "/api/lead", "/api/teste7d/inscricao"]) {
    assert.equal(bloqueadoNoHostPrincipal(p, "production"), false, p);
  }
});

test("signup: produção só em Production; hmg em Preview e local", () => {
  assert.equal(urlDoSignup({ vercelEnv: "production" }), SIGNUP_URL_PRODUCAO);
  assert.equal(urlDoSignup({ vercelEnv: "preview" }), SIGNUP_URL_HMG);
  assert.equal(urlDoSignup({ vercelEnv: "development" }), SIGNUP_URL_HMG);
  assert.equal(urlDoSignup({}), SIGNUP_URL_HMG);
  assert.match(SIGNUP_URL_HMG, /-hmg-/);
  assert.doesNotMatch(SIGNUP_URL_PRODUCAO, /hmg/);
});

test("signup: TRIAL_SIGNUP_URL sobrescreve o padrão", () => {
  assert.equal(urlDoSignup({ trialSignupUrl: " https://x.test/s ", vercelEnv: "production" }), "https://x.test/s");
  assert.equal(urlDoSignup({ trialSignupUrl: "", vercelEnv: "production" }), SIGNUP_URL_PRODUCAO);
});
