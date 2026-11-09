// Rodar: node --test src/lib/fluxo-b/*.test.mjs
//
// Funcionalidade: do cadastro à área logada do ady, em produção. Roda o código
// real (rota /api/fluxo-b/signup + sessão + entrarNoApp); só o `fetch` pra API
// do app é simulado, pra não criar conta de verdade, e o navegador é um stub.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join, resolve as resolverCaminho } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// O `node --test` não conhece o alias "@/" nem imports sem extensão.
const SRC = resolverCaminho(dirname(fileURLToPath(import.meta.url)), "../..");

function arquivoTs(base) {
  return [`${base}.ts`, `${base}.tsx`].find(existsSync);
}

registerHooks({
  resolve(especificador, contexto, proximo) {
    if (especificador === "next/server") return proximo("next/server.js", contexto);
    if (especificador.startsWith("@/")) {
      const arquivo = arquivoTs(join(SRC, especificador.slice(2)));
      if (arquivo) return { url: pathToFileURL(arquivo).href, shortCircuit: true };
    }
    if (especificador.startsWith(".") && contexto.parentURL?.startsWith(pathToFileURL(SRC).href)) {
      const arquivo = arquivoTs(fileURLToPath(new URL(especificador, contexto.parentURL)));
      if (arquivo) return { url: pathToFileURL(arquivo).href, shortCircuit: true };
    }
    return proximo(especificador, contexto);
  },
});

const { POST } = await import("../../app/api/fluxo-b/signup/route.ts");
const { entrarNoApp } = await import("./entrarNoApp.ts");
const { toE164Br } = await import("./phone.ts");
const { sessao } = await import("./sessao.ts");

const API_SIGNUP = "https://clickhero-fury-api.u7pe19.easypanel.host/api/public/trial/signup";
const LINK_DE_LOGIN = "https://app.useady.com.br/trial/acesso#token=token-de-teste";

function simularNavegador() {
  const dados = new Map();
  const redirecionamentos = [];
  globalThis.sessionStorage = {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
  };
  globalThis.window = {
    location: { assign: (url) => redirecionamentos.push(url) },
    // Sem GTM carregado, a saída acontece pelo timer de segurança.
    setTimeout: (fn) => {
      fn();
      return 0;
    },
  };
  return redirecionamentos;
}

test("Cenário: usuário novo preenche o cadastro e cai na área logada do ady", async (t) => {
  const chamadasApi = [];
  let redirecionamentos;
  let respostaDaRota;
  let corpoDaRota;

  process.env.VERCEL_ENV = "production";
  delete process.env.TRIAL_SIGNUP_URL;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    chamadasApi.push({ url: String(url), init });
    return new Response(JSON.stringify({ created: true, redirect_url: LINK_DE_LOGIN, message: "ok" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  });

  await t.test("Dado que o visitante preencheu o formulário em useady.com.br/testegratis", () => {
    redirecionamentos = simularNavegador();
    sessao.gravarLead({
      name: "Maria Teste",
      email: "maria.teste@exemplo.com.br",
      phone: toE164Br("(85) 99999-9999"),
      empresa_site: "",
    });
  });

  await t.test("Quando a tela de criação envia o cadastro", async () => {
    const lead = sessao.lerLead();
    respostaDaRota = await POST(
      new Request("https://useady.com.br/api/fluxo-b/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://useady.com.br",
          host: "useady.com.br",
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify(lead),
      }),
    );
    corpoDaRota = await respostaDaRota.json();
  });

  await t.test("Então a API de produção do app é chamada com os dados do lead", () => {
    assert.equal(chamadasApi.length, 1);
    assert.equal(chamadasApi[0].url, API_SIGNUP);
    assert.equal(chamadasApi[0].init.method, "POST");
    assert.deepEqual(JSON.parse(chamadasApi[0].init.body), {
      name: "Maria Teste",
      email: "maria.teste@exemplo.com.br",
      phone: "+5585999999999",
    });
  });

  await t.test("E a rota devolve o link de login recebido da API", () => {
    assert.equal(respostaDaRota.status, 200);
    assert.deepEqual(corpoDaRota, { ok: true, redirectUrl: LINK_DE_LOGIN });
  });

  await t.test("E o navegador é redirecionado para app.useady.com.br/trial/acesso com o token", () => {
    sessao.gravarConta(corpoDaRota.redirectUrl);

    assert.equal(entrarNoApp(sessao.lerConta()), "ok");

    assert.deepEqual(redirecionamentos, [LINK_DE_LOGIN]);
    const destino = new URL(redirecionamentos[0]);
    assert.equal(destino.origin, "https://app.useady.com.br");
    assert.equal(destino.pathname, "/trial/acesso");
    assert.equal(destino.hash, "#token=token-de-teste");
  });
});
