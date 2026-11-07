// Rodar: node --test src/lib/fluxo-b/regras.test.mjs (Node ≥ 22.18, que
// remove os tipos do .ts sozinho).
import assert from "node:assert/strict";
import { test } from "node:test";
import { decidirHostPrincipal, resolverMock, SIGNUP_URL_HMG, SIGNUP_URL_PRODUCAO, urlDoSignup } from "./regras.ts";

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

test("domínio principal e preview: /testegratis[/...] → /fluxo-b[/...] em todo ambiente", () => {
  for (const env of ["production", "preview", undefined]) {
    assert.deepEqual(decidirHostPrincipal("/testegratis", env), { tipo: "reescrever", destino: "/fluxo-b" }, env);
    assert.deepEqual(decidirHostPrincipal("/testegratis/", env), { tipo: "reescrever", destino: "/fluxo-b" }, env);
    assert.deepEqual(decidirHostPrincipal("/testegratis/criando", env), { tipo: "reescrever", destino: "/fluxo-b/criando" }, env);
    assert.deepEqual(decidirHostPrincipal("/testegratis/app-mock", env), { tipo: "reescrever", destino: "/fluxo-b/app-mock" }, env);
  }
});

test("/fluxo-b direto: 404 em produção; fora dela segue com noindex", () => {
  for (const p of ["/fluxo-b", "/fluxo-b/criando"]) {
    assert.deepEqual(decidirHostPrincipal(p, "production"), { tipo: "bloquear" }, p);
    assert.deepEqual(decidirHostPrincipal(p, "preview"), { tipo: "noindex" }, p);
    assert.deepEqual(decidirHostPrincipal(p, undefined), { tipo: "noindex" }, p);
  }
});

test("o resto do domínio principal fica intocado (inclui / e a API)", () => {
  for (const p of ["/", "/obrigado", "/roadmap", "/workshop", "/testegratisx", "/teste", "/fluxo-bx", "/api/fluxo-b/signup", "/api/lead", "/api/teste7d/inscricao"]) {
    for (const env of ["production", "preview"]) assert.equal(decidirHostPrincipal(p, env), null, `${p} ${env}`);
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
