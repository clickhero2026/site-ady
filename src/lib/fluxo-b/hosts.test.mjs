// Rodar: node --test src/lib/fluxo-b/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { ehHostDoFluxoB, hostsDaApi, hostsDoFluxoB, montarCaminho, prefixoDaUrl } from "./regras.ts";

const PROPRIO = "teste.useady.com.br";

test("hosts do Fluxo B (rewrite de /): host próprio + extras", () => {
  assert.deepEqual(hostsDoFluxoB(PROPRIO), [PROPRIO]);
  assert.deepEqual(hostsDoFluxoB(PROPRIO, " Outro.test , ,teste.useady.com.br"), [PROPRIO, "outro.test"]);
  assert.equal(ehHostDoFluxoB("teste.useady.com.br:443", PROPRIO), true);
  assert.equal(ehHostDoFluxoB(null, PROPRIO), false);
});

test("domínio principal e LP atual NUNCA viram host do Fluxo B, nem por engano na env", () => {
  const extras = "useady.com.br, www.useady.com.br, LP.useady.com.br";
  assert.deepEqual(hostsDoFluxoB(PROPRIO, extras), [PROPRIO]);
  for (const h of ["useady.com.br", "www.useady.com.br", "lp.useady.com.br", "useady.com.br:443"]) {
    assert.equal(ehHostDoFluxoB(h, PROPRIO, extras), false, h);
  }
  assert.deepEqual(hostsDoFluxoB("useady.com.br"), []); // nem como host próprio
});

test("hosts da API: domínio principal, www e hosts do Fluxo B (separada do rewrite)", () => {
  assert.deepEqual(hostsDaApi(PROPRIO), ["useady.com.br", "www.useady.com.br", PROPRIO]);
  assert.deepEqual(hostsDaApi(PROPRIO, "outro.test,useady.com.br"), ["useady.com.br", "www.useady.com.br", PROPRIO, "outro.test"]);
  assert.ok(!hostsDaApi(PROPRIO).includes("lp.useady.com.br"));
});

test("prefixo das rotas pela URL de entrada", () => {
  assert.equal(prefixoDaUrl("/testegratis"), "/testegratis");
  assert.equal(prefixoDaUrl("/testegratis/criando"), "/testegratis");
  assert.equal(prefixoDaUrl("/fluxo-b"), "/fluxo-b");
  assert.equal(prefixoDaUrl("/fluxo-b/criando"), "/fluxo-b");
  assert.equal(prefixoDaUrl("/"), "");
  assert.equal(prefixoDaUrl("/criando"), "");
  assert.equal(prefixoDaUrl("/testegratisx"), "");
});

test("montar caminho com cada prefixo", () => {
  assert.equal(montarCaminho("/testegratis", "/criando"), "/testegratis/criando");
  assert.equal(montarCaminho("/testegratis", "/", "#cadastro"), "/testegratis#cadastro");
  assert.equal(montarCaminho("/fluxo-b", "/app-mock"), "/fluxo-b/app-mock");
  assert.equal(montarCaminho("", "/criando"), "/criando");
  assert.equal(montarCaminho("", "/", "#cadastro"), "/#cadastro");
});
