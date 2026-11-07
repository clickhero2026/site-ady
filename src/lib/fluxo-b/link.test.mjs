// Rodar: node --test src/lib/fluxo-b/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { APP_FRONTEND_ORIGIN, destinoPermitido, LINK_VALIDADE_UTIL_MS, linkExpirado, origensDeRedirect, SIGNUP_URL_HMG, SIGNUP_URL_PRODUCAO } from "./regras.ts";

const HMG = new URL(SIGNUP_URL_HMG).origin;
const PROD = new URL(SIGNUP_URL_PRODUCAO).origin;
const PERMITIDA = "https://api-permitida.com";

test("origens padrão: Production = API de produção + frontend do app; fora dela = só hmg", () => {
  assert.deepEqual(origensDeRedirect({ vercelEnv: "production" }), [PROD, "https://app.useady.com.br"]);
  assert.equal(APP_FRONTEND_ORIGIN, "https://app.useady.com.br");
  assert.deepEqual(origensDeRedirect({ vercelEnv: "preview" }), [HMG]);
  assert.deepEqual(origensDeRedirect({}), [HMG]);
  assert.ok(!origensDeRedirect({ vercelEnv: "production" }).includes(HMG)); // hmg nunca em produção
});

test("FLUXO_B_REDIRECT_ORIGINS continua sobrescrevendo o padrão de produção", () => {
  assert.deepEqual(origensDeRedirect({ lista: "https://so-esta.test", vercelEnv: "production" }), ["https://so-esta.test"]);
});

test("fragmento #token chega intacto em destinoPermitido", () => {
  const origens = origensDeRedirect({ vercelEnv: "production" });
  const link = "https://app.useady.com.br/trial/acesso#token=abc";
  assert.equal(destinoPermitido(link, origens), link);
  const longo = "https://app.useady.com.br/trial/acesso?x=1#token=eyJ.a-b_c%2Bd%3D&next=/dashboard";
  assert.equal(destinoPermitido(longo, origens), longo);
  assert.equal(destinoPermitido("https://app.useady.com.br.evil.com/trial/acesso#token=abc", origens), null);
  assert.equal(destinoPermitido("http://app.useady.com.br/trial/acesso#token=abc", origens), null);
});

test("FLUXO_B_REDIRECT_ORIGINS: lista por vírgula, normaliza e descarta inseguras", () => {
  const lista = ` ${PERMITIDA}/qualquer/caminho , https://outra.test:443, http://inseguro.test, https://u:p@cred.test, lixo `;
  assert.deepEqual(origensDeRedirect({ lista, vercelEnv: "production" }), [PERMITIDA, "https://outra.test"]);
  assert.deepEqual(origensDeRedirect({ lista: "http://so-http.test", vercelEnv: "preview" }), []);
});

test("destino na origem permitida passa (com caminho e query)", () => {
  assert.equal(destinoPermitido(`${PERMITIDA}/auth/link?t=abc`, [PERMITIDA]), `${PERMITIDA}/auth/link?t=abc`);
  assert.equal(destinoPermitido(`${PERMITIDA}:443/x`, [PERMITIDA]), `${PERMITIDA}/x`);
});

test("bloqueia: evil.com, usuário@host, http, subdomínio parecido, porta, relativo", () => {
  const casos = [
    "https://evil.com/auth?t=1",
    "https://api-permitida.com@evil.com/auth",
    "https://user:senha@api-permitida.com/auth",
    "http://api-permitida.com/auth",
    "https://api-permitida.com.evil.com/auth",
    "https://evil-api-permitida.com/auth",
    "https://sub.api-permitida.com/auth",
    "https://api-permitida.com:8443/auth",
    "/auth/link",
    "javascript:alert(1)",
    "",
  ];
  for (const url of casos) assert.equal(destinoPermitido(url, [PERMITIDA]), null, url);
});

test("lista vazia não permite nada", () => {
  assert.equal(destinoPermitido(`${PERMITIDA}/x`, []), null);
});

test("mock: libera só a própria origem do site (inclusive http local)", () => {
  const origemMock = "http://localhost:3100";
  assert.equal(destinoPermitido(`${origemMock}/fluxo-b/app-mock`, [PERMITIDA], { origemMock }), `${origemMock}/fluxo-b/app-mock`);
  assert.equal(destinoPermitido("http://localhost:3101/x", [PERMITIDA], { origemMock }), null);
  assert.equal(destinoPermitido("http://user@localhost:3100/x", [PERMITIDA], { origemMock }), null);
  assert.equal(destinoPermitido(`${origemMock}/fluxo-b/app-mock`, [PERMITIDA]), null); // sem mock
});

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
