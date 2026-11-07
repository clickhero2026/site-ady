"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DURACAO_TESTE, PROGRESSO, SIGNUP_TIMEOUT_MS, TEXTO_EMAIL_EXISTENTE, type ConfigCliente } from "@/config/fluxoB";
import { trackContaCriada, trackErroCriacao } from "@/lib/fluxo-b/analytics";
import { irPara, caminho } from "@/lib/fluxo-b/rotas";
import { primeiroNome, sessao, type LeadFluxoB } from "@/lib/fluxo-b/sessao";
import type { SignupCode, SignupResult } from "@/lib/fluxo-b/signup";
import { parseSignupResponse } from "@/lib/fluxo-b/signupResposta";
import { AcoesContaExistente } from "./ContaExistente";
import { useSessaoFluxoB } from "@/lib/fluxo-b/useSessao";
import { FluxoBShell } from "./FluxoBShell";
import e from "./etapas.module.css";
import styles from "./CriandoConta.module.css";

type Fase = { tipo: "criando" } | { tipo: "sucesso" } | { tipo: "erro"; code: SignupCode };

const ESPERA_SUCESSO_MS = 1500;

/** `?mock=` desta tela ou o guardado na chegada à LP. */
function modoMock(): string | null {
  return new URL(window.location.href).searchParams.get("mock") ?? sessao.lerMock();
}

/**
 * Modo mock (só fora de produção): simula a RESPOSTA da API e passa pelo
 * mesmo `parseSignupResponse` do servidor.
 * - `ok` (ou sem `?mock`): conta nova com `loginUrl` → /fluxo-b/app-mock
 * - `exists`: `error.code = EMAIL_JA_CADASTRADO`
 * - `invalid`: `VALIDATION_ERROR`; `network`: falha de rede
 * - `semlink`: 202 sem link (estado atual da hmg)
 * - `expirado`: link recebido há 56 min (testa a expiração)
 */
async function signupMock(): Promise<SignupResult> {
  const modo = modoMock();
  await new Promise((r) => setTimeout(r, 1200));
  if (modo === "network") return { ok: false, code: "NETWORK" };
  if (modo === "exists") return parseSignupResponse(409, { success: false, error: { code: "EMAIL_JA_CADASTRADO" } });
  if (modo === "invalid") return parseSignupResponse(400, { success: false, error: { code: "VALIDATION_ERROR" } });
  if (modo === "semlink") return parseSignupResponse(202, { message: "Se for possível, enviaremos um link de acesso." });
  return parseSignupResponse(201, { loginUrl: `${window.location.origin}${caminho("appMock")}?t=mock` });
}

const MOCK_EXPIRADO_MS = 56 * 60 * 1000;

async function signup(lead: LeadFluxoB, mock: boolean): Promise<SignupResult> {
  if (mock) return signupMock();
  try {
    const res = await fetch("/api/fluxo-b/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lead.name, email: lead.email, phone: lead.phone }),
      // Um pouco além do tempo-limite do servidor, pra ele responder primeiro.
      signal: AbortSignal.timeout(SIGNUP_TIMEOUT_MS + 2000),
    });
    const json = (await res.json().catch(() => null)) as (SignupResult & { debug?: string }) | null;
    if (json?.debug) console.error(json.debug); // só vem em desenvolvimento
    if (json && json.ok === true) return { ok: true, redirectUrl: typeof json.redirectUrl === "string" ? json.redirectUrl : null };
    if (json && json.ok === false && typeof json.code === "string") return { ok: false, code: json.code };
    return { ok: false, code: res.ok ? "UNKNOWN" : "NETWORK" };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}

/**
 * Tela 2 do Fluxo B — "Sua conta foi criada!". É aqui que a conta nasce
 * no app: o POST sai ao montar, uma vez só (ref contra o duplo efeito do
 * modo estrito; flag na sessão contra recarga — com a conta já criada,
 * segue direto pro ramo, sem novo POST). "Conta criada" só aparece
 * depois do POST confirmar.
 */
export function CriandoConta({ cfg }: { cfg: ConfigCliente }) {
  const mock = cfg.mock;
  const { lead, conta } = useSessaoFluxoB();
  const [fase, setFase] = useState<Fase>({ tipo: "criando" });
  const iniciado = useRef(false);

  const aplicar = useCallback((r: SignupResult) => {
    if (r.ok) {
      const atraso = mock.ativo && modoMock() === "expirado" ? MOCK_EXPIRADO_MS : 0;
      sessao.gravarConta(r.redirectUrl, Date.now() - atraso);
      trackContaCriada();
      setFase({ tipo: "sucesso" });
      window.setTimeout(() => irPara("ramo", { replace: true }), ESPERA_SUCESSO_MS);
    } else {
      trackErroCriacao(r.code);
      setFase({ tipo: "erro", code: r.code });
    }
  }, [mock.ativo]);

  useEffect(() => {
    if (lead === undefined || iniciado.current) return;
    iniciado.current = true;
    if (!lead) {
      irPara("lp", { hash: "#cadastro", replace: true });
      return;
    }
    if (conta?.criada) {
      irPara("ramo", { replace: true });
      return;
    }
    void signup(lead, mock.ativo).then(aplicar);
  }, [lead, conta, aplicar, mock.ativo]);

  const nome = primeiroNome(lead?.name);
  const tentarDeNovo = () => {
    if (!lead) return;
    setFase({ tipo: "criando" });
    void signup(lead, mock.ativo).then(aplicar);
  };

  return (
    <FluxoBShell
      progresso={PROGRESSO.criando}
      painel={
        <>
          <p className={styles.boasVindas}>
            <strong>Que bom ter você aqui{nome ? `, ${nome}` : ""}!</strong>
          </p>
          {/* Em erro (ex.: e-mail já cadastrado) não promete conta nova. */}
          {fase.tipo !== "erro" && <p>Seu teste grátis de {DURACAO_TESTE} começa agora.</p>}
        </>
      }
    >
      {fase.tipo === "erro" ? (
        <ErroCriacao code={fase.code} onTentar={tentarDeNovo} />
      ) : (
        <div className={styles.centro}>
          <div className={styles.selo} data-sucesso={fase.tipo === "sucesso" || undefined} aria-hidden="true">
            {fase.tipo === "sucesso" ? <Check size={56} strokeWidth={3} /> : <span className={styles.selospinner} />}
          </div>

          <div role="status" aria-live="polite" className={styles.textos}>
            <h1 className={e.titulo}>{fase.tipo === "sucesso" ? "Sua conta foi criada!" : "Criando sua conta…"}</h1>
            {fase.tipo === "sucesso" && <p className={e.apoio}>Agora falta pouco pra deixar tudo do seu jeito.</p>}
          </div>

          <div className={styles.preparando}>
            <p>Preparando seu painel</p>
            <span className={styles.trilho} aria-hidden="true">
              <span className={styles.corre} />
            </span>
          </div>
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
        <AcoesContaExistente />
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
