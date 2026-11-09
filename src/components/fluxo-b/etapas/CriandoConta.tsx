"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APP_LOGIN_URL, DURACAO_TESTE, PROGRESSO, SIGNUP_TIMEOUT_MS, TEXTO_EMAIL_EXISTENTE, type ConfigCliente } from "@/config/fluxoB";
import { trackContaCriada, trackErroCriacao } from "@/lib/fluxo-b/analytics";
import { entrarNoApp } from "@/lib/fluxo-b/entrarNoApp";
import { linkExpirado } from "@/lib/fluxo-b/regras";
import { caminho, irPara } from "@/lib/fluxo-b/rotas";
import { primeiroNome, sessao, type ContaFluxoB, type LeadFluxoB } from "@/lib/fluxo-b/sessao";
import type { SignupCode, SignupResult } from "@/lib/fluxo-b/signup";
import { parseSignupResponse } from "@/lib/fluxo-b/signupResposta";
import { useSessaoFluxoB } from "@/lib/fluxo-b/useSessao";
import { AcoesContaExistente } from "./ContaExistente";
import { FluxoBShell } from "./FluxoBShell";
import { LinkExpirado } from "./LinkExpirado";
import e from "./etapas.module.css";
import styles from "./CriandoConta.module.css";

type Fase =
  | { tipo: "criando" }
  | { tipo: "sucesso" } // conta criada, saindo pro app em ~1,5s
  | { tipo: "sem-link" } // conta criada, sem link utilizável: acesso vai por e-mail
  | { tipo: "ja-aberto" } // link já usado (recarga/voltar)
  | { tipo: "expirado" }
  | { tipo: "erro"; code: SignupCode };

const ESPERA_SUCESSO_MS = 1500;

/** `?mock=` desta tela ou o guardado na chegada à LP. */
function modoMock(): string | null {
  return new URL(window.location.href).searchParams.get("mock") ?? sessao.lerMock();
}

/**
 * Modo mock (só fora de produção): simula a RESPOSTA da API e passa pelo
 * mesmo `parseSignupResponse` do servidor.
 * - `ok` (ou sem `?mock`): `{ redirect_url }` → /fluxo-b/app-mock
 * - `exists`: `{ erro: "EMAIL_JA_CADASTRADO" }`
 * - `invalid`: `VALIDATION_ERROR`; `network`: falha de rede; `limite`: 429
 * - `semlink`: 202 sem link (estado atual da hmg)
 * - `expirado`: link recebido há 56 min
 */
async function signupMock(): Promise<SignupResult> {
  const modo = modoMock();
  await new Promise((r) => setTimeout(r, 1200));
  if (modo === "network") return { ok: false, code: "NETWORK" };
  if (modo === "exists") return parseSignupResponse(409, { erro: "EMAIL_JA_CADASTRADO" });
  if (modo === "invalid") return parseSignupResponse(400, { success: false, error: { code: "VALIDATION_ERROR" } });
  if (modo === "limite") return parseSignupResponse(429, {});
  if (modo === "semlink") return parseSignupResponse(202, { message: "Se for possível, enviaremos um link de acesso." });
  return parseSignupResponse(201, { redirect_url: `${window.location.origin}${caminho("appMock")}?t=mock` });
}

const MOCK_EXPIRADO_MS = 56 * 60 * 1000;

async function signup(lead: LeadFluxoB, mock: boolean): Promise<SignupResult> {
  if (mock) return signupMock();
  try {
    const res = await fetch("/api/fluxo-b/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lead.name, email: lead.email, phone: lead.phone, empresa_site: lead.empresa_site ?? "" }),
      // Um pouco além do tempo-limite do servidor, pra ele responder primeiro.
      signal: AbortSignal.timeout(SIGNUP_TIMEOUT_MS + 2000),
    });
    const json = (await res.json().catch(() => null)) as (SignupResult & { debug?: string }) | null;
    if (json?.debug) console.error(json.debug); // só vem em desenvolvimento
    if (json && json.ok === true) return { ok: true, redirectUrl: typeof json.redirectUrl === "string" ? json.redirectUrl : null };
    if (json && json.ok === false && typeof json.code === "string") return { ok: false, code: json.code };
    if (res.status === 429) return { ok: false, code: "RATE_LIMIT" };
    return { ok: false, code: res.ok ? "UNKNOWN" : "NETWORK" };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}

/**
 * Tela "criando" do Fluxo B — é aqui que a conta nasce no app e de onde o
 * usuário sai direto pro app (senha e ramo ficam no modal de primeiro
 * acesso do app).
 *
 * O POST sai ao montar, uma vez só (ref contra o duplo efeito do modo
 * estrito; conta na sessão contra recarga). "Conta criada" só aparece
 * depois do POST confirmar; ~1,5s depois sai pelo `redirect_url`. O link
 * é de uso único: depois de usado, recarregar ou voltar mostra "Seu
 * acesso já foi aberto." em vez de redirecionar de novo.
 */
export function CriandoConta({ cfg }: { cfg: ConfigCliente }) {
  const { lead, conta } = useSessaoFluxoB();
  const [fase, setFase] = useState<Fase>({ tipo: "criando" });
  const iniciado = useRef(false);
  const mock = cfg.mock;

  /** Conta já criada (agora ou numa visita anterior): decide a saída. */
  const seguir = useCallback(
    (c: ContaFluxoB) => {
      if (c.usado) return setFase({ tipo: "ja-aberto" });
      if (!c.redirectUrl) return setFase({ tipo: "sem-link" });
      if (linkExpirado(c.recebidoEm, Date.now())) return setFase({ tipo: "expirado" });
      setFase({ tipo: "sucesso" });
      window.setTimeout(() => {
        const atual = sessao.lerConta() ?? c;
        const r = entrarNoApp(atual);
        if (r === "usado") setFase({ tipo: "ja-aberto" });
        else if (r === "expirado") setFase({ tipo: "expirado" });
        else if (r === "sem-destino") setFase({ tipo: "sem-link" });
      }, ESPERA_SUCESSO_MS);
    },
    [],
  );

  const aplicar = useCallback(
    (r: SignupResult) => {
      if (!r.ok) {
        trackErroCriacao(r.code);
        setFase({ tipo: "erro", code: r.code });
        return;
      }
      const atraso = mock.ativo && modoMock() === "expirado" ? MOCK_EXPIRADO_MS : 0;
      sessao.gravarConta(r.redirectUrl, Date.now() - atraso);
      trackContaCriada();
      const salva = sessao.lerConta();
      seguir(salva ?? { criada: true, redirectUrl: r.redirectUrl, recebidoEm: Date.now() - atraso, usado: false });
    },
    [mock.ativo, seguir],
  );

  useEffect(() => {
    if (lead === undefined || iniciado.current) return;
    iniciado.current = true;
    if (!lead) {
      irPara("lp", { hash: "#cadastro", replace: true });
      return;
    }
    // Conta já existe nesta aba (recarga/voltar): sem novo POST.
    if (conta?.criada) {
      void Promise.resolve(conta).then(seguir);
      return;
    }
    void signup(lead, mock.ativo).then(aplicar);
  }, [lead, conta, aplicar, seguir, mock.ativo]);

  // Voltar do app com a página restaurada do cache (bfcache): o estado
  // antigo ("Sua conta foi criada!") não vale mais — o link já foi usado.
  useEffect(() => {
    const aoMostrar = (ev: PageTransitionEvent) => {
      if (ev.persisted && sessao.lerConta()?.usado) setFase({ tipo: "ja-aberto" });
    };
    window.addEventListener("pageshow", aoMostrar);
    return () => window.removeEventListener("pageshow", aoMostrar);
  }, []);

  const nome = primeiroNome(lead?.name);
  const tentarDeNovo = () => {
    if (!lead) return;
    setFase({ tipo: "criando" });
    void signup(lead, mock.ativo).then(aplicar);
  };
  const contaExiste = fase.tipo !== "criando" && fase.tipo !== "erro";

  return (
    <FluxoBShell
      progresso={contaExiste ? PROGRESSO.app : PROGRESSO.criando}
      painel={
        <>
          <p className={styles.boasVindas}>
            <strong>Que bom ter você aqui{nome ? `, ${nome}` : ""}!</strong>
          </p>
          {/* Em erro (ex.: e-mail já cadastrado) não promete conta nova. */}
          {fase.tipo !== "erro" && <p>Seus {DURACAO_TESTE} de teste grátis começam assim que você entra no ady.</p>}
        </>
      }
    >
      {fase.tipo === "erro" ? (
        <ErroCriacao code={fase.code} onTentar={tentarDeNovo} />
      ) : fase.tipo === "expirado" ? (
        <LinkExpirado />
      ) : fase.tipo === "ja-aberto" ? (
        <div role="status" aria-live="polite" className={styles.aviso}>
          <h1 className={e.titulo}>Seu acesso já foi aberto.</h1>
          <AcoesContaExistente principal="entrar" />
        </div>
      ) : fase.tipo === "sem-link" ? (
        <div role="status" aria-live="polite" className={styles.aviso}>
          <h1 className={e.titulo}>Sua conta está pronta.</h1>
          <p className={e.apoio}>Enviamos um e-mail com o seu acesso.</p>
          {APP_LOGIN_URL && (
            <div className={e.acoes}>
              <a href={APP_LOGIN_URL} className={`lp-cta lp-cta--wide ${e.botao}`}>
                Entrar
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.centro}>
          <div className={styles.selo} data-sucesso={fase.tipo === "sucesso" || undefined} aria-hidden="true">
            {fase.tipo === "sucesso" ? <Check size={56} strokeWidth={3} /> : <span className={styles.selospinner} />}
          </div>

          <div role="status" aria-live="polite" className={styles.textos}>
            <h1 className={e.titulo}>{fase.tipo === "sucesso" ? "Sua conta foi criada!" : "Criando sua conta…"}</h1>
            {fase.tipo === "sucesso" && <p className={e.apoio}>Estamos abrindo o ady para você.</p>}
          </div>

          {fase.tipo === "sucesso" && (
            <div className={styles.preparando}>
              <p>Entrando no ady</p>
              <span className={styles.trilho} aria-hidden="true">
                <span className={styles.corre} />
              </span>
            </div>
          )}
        </div>
      )}
    </FluxoBShell>
  );
}

function ErroCriacao({ code, onTentar }: { code: SignupCode; onTentar: () => void }) {
  if (code === "EMAIL_EXISTS") {
    return (
      <div role="alert" className={e.erro}>
        <h1 className={e.titulo}>{TEXTO_EMAIL_EXISTENTE.titulo}</h1>
        <p className={e.apoio}>{TEXTO_EMAIL_EXISTENTE.apoio}</p>
        <AcoesContaExistente principal="redefinir" />
      </div>
    );
  }

  if (code === "INVALID") {
    return (
      <div role="alert" className={e.erro}>
        <h1 className={e.titulo}>Confere seus dados</h1>
        <p className={e.apoio}>Algum dado não passou. Volte ao formulário, confira nome, WhatsApp e e-mail e envie de novo.</p>
        <div className={e.acoes}>
          <a href={caminho("lp", "#cadastro")} className={`lp-cta lp-cta--wide ${e.botao}`}>
            Voltar ao formulário
          </a>
        </div>
      </div>
    );
  }

  if (code === "RATE_LIMIT") {
    return (
      <div role="alert" className={e.erro}>
        <h1 className={e.titulo}>Muitas tentativas. Tente de novo em alguns minutos.</h1>
        <div className={e.acoes}>
          <button type="button" onClick={onTentar} className={e.secundario}>
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  // NETWORK / UNKNOWN. A LP atual não tem WhatsApp de suporte, então não
  // há link de contato aqui (não inventamos número).
  return (
    <div role="alert" className={e.erro}>
      <h1 className={e.titulo}>Não conseguimos criar seu acesso agora.</h1>
      <p className={e.apoio}>Pode ser a conexão. Seus dados estão guardados: é só tentar de novo.</p>
      <div className={e.acoes}>
        <button type="button" onClick={onTentar} className={`lp-cta lp-cta--wide ${e.botao}`}>
          Tentar de novo
        </button>
      </div>
    </div>
  );
}
