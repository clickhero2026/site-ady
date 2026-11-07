// Rodar: node --test src/lib/fluxo-b/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { criarLimitador, LIMITE_EMAIL, LIMITE_IP, origemPermitidaNaRota } from "./protecao.ts";
import { hostsDaApi } from "./regras.ts";

test("limite por IP: 5 em 10 min, a 6ª é recusada, libera depois da janela", () => {
  const l = criarLimitador(LIMITE_IP);
  const t0 = 1_000_000;
  for (let i = 0; i < 5; i++) assert.equal(l.tentar("ip-a", t0 + i * 1000), true, `tentativa ${i + 1}`);
  assert.equal(l.tentar("ip-a", t0 + 6000), false);
  assert.equal(l.tentar("ip-b", t0 + 6000), true); // outro IP não é afetado
  assert.ok(l.esperaSegundos("ip-a", t0 + 6000) > 0);
  assert.equal(l.tentar("ip-a", t0 + LIMITE_IP.janelaMs + 1), true); // a 1ª saiu da janela
});

test("limite por e-mail: 1 por minuto", () => {
  const l = criarLimitador(LIMITE_EMAIL);
  assert.equal(l.tentar("e", 0), true);
  assert.equal(l.tentar("e", 30_000), false);
  assert.equal(l.esperaSegundos("e", 30_000), 30);
  assert.equal(l.tentar("e", 60_001), true);
});

test("liberar devolve a tentativa (falha de rede na API não conta)", () => {
  const l = criarLimitador(LIMITE_EMAIL);
  assert.equal(l.tentar("e", 0), true);
  l.liberar("e");
  assert.equal(l.tentar("e", 1000), true);
});

test("memória limitada: não passa de maxChaves", () => {
  const l = criarLimitador({ max: 1, janelaMs: 60_000, maxChaves: 3 });
  for (let i = 0; i < 10; i++) l.tentar(`k${i}`, i);
  assert.ok(l.tamanho() <= 3);
});

const base = { hostsPermitidos: hostsDaApi("teste.useady.com.br"), hostsPreview: ["site-ady-abc.vercel.app", undefined] };

test("origem: domínio principal (/testegratis), www e host próprio em qualquer ambiente", () => {
  for (const vercelEnv of ["production", "preview", undefined]) {
    for (const h of ["useady.com.br", "www.useady.com.br", "teste.useady.com.br"]) {
      assert.equal(origemPermitidaNaRota({ ...base, vercelEnv, origin: `https://${h}`, host: h }), true, `${h} ${vercelEnv}`);
    }
  }
});

test("origem: preview e localhost só fora de produção", () => {
  assert.equal(origemPermitidaNaRota({ ...base, vercelEnv: "preview", origin: "https://site-ady-abc.vercel.app", host: "site-ady-abc.vercel.app" }), true);
  assert.equal(origemPermitidaNaRota({ ...base, origin: "http://localhost:3000", host: "localhost:3000" }), true);
  assert.equal(origemPermitidaNaRota({ ...base, vercelEnv: "production", origin: "https://site-ady-abc.vercel.app", host: "site-ady-abc.vercel.app" }), false);
  assert.equal(origemPermitidaNaRota({ ...base, vercelEnv: "production", origin: "http://localhost:3000", host: "localhost:3000" }), false);
});

test("origem: recusa sem Origin, origem cruzada, host fora da lista, credenciais", () => {
  const casos = [
    { origin: null, host: "teste.useady.com.br" },
    { origin: "https://evil.com", host: "teste.useady.com.br" },
    { origin: "https://teste.useady.com.br", host: "evil.com" },
    { origin: "https://evil.com", host: "evil.com" },
    { origin: "https://lp.useady.com.br", host: "lp.useady.com.br" },
    { origin: "https://teste.useady.com.br.evil.com", host: "teste.useady.com.br.evil.com" },
    { origin: "https://user:x@teste.useady.com.br", host: "teste.useady.com.br" },
    { origin: "null", host: "teste.useady.com.br" },
  ];
  for (const c of casos) assert.equal(origemPermitidaNaRota({ ...base, vercelEnv: "preview", ...c }), false, JSON.stringify(c));
});
