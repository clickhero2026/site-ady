"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APP_LOGIN_URL, DURACAO_TESTE, PROGRESSO, SIGNUP_TIMEOUT_MS, type EstadoMock } from "@/config/fluxoB";
import { trackContaCriada, trackErroCriacao } from "@/lib/fluxo-b/analytics";
import { irPara, caminho } from "@/lib/fluxo-b/rotas";
import { primeiroNome, sessao, type LeadFluxoB } from "@/lib/fluxo-b/sessao";
import type { SignupCode, SignupResult } from "@/lib/fluxo-b/signup";
import { useSessaoFluxoB } from "@/lib/fluxo-b/useSessao";
import { FluxoBShell } from "./FluxoBShell";
import e from "./etapas.module.css";
import styles from "./CriandoConta.module.css";

type Fase = { tipo: "criando" } | { tipo: "sucesso" } | { tipo: "erro"; code: SignupCode };

const ESPERA_SUCESSO_MS = 1500;

/** Modo mock: `?mock=exists|invalid|network` (na URL desta tela ou na da
 * LP) simula cada erro; sem `?mock`, sucesso com destino de teste. */
async function signupMock(): Promise<SignupResult> {
  const modo = new URL(window.location.href).searchParams.get("mock") ?? sessao.lerMock();
  await new Promise((r) => setTimeout(r, 1200));
  if (modo === "exists") return { ok: false, code: "EMAIL_EXISTS" };
  if (modo === "invalid") return { ok: false, code: "INVALID" };
  if (modo === "network") return { ok: false, code: "NETWORK" };
  return { ok: true, redirectUrl: `${window.location.origin}${caminho("appMock")}` };
}

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
export function CriandoConta({ mock }: { mock: EstadoMock }) {
  const { lead, conta } = useSessaoFluxoB();
  const [fase, setFase] = useState<Fase>({ tipo: "criando" });
  const iniciado = useRef(false);

  const aplicar = useCallback((r: SignupResult) => {
    if (r.ok) {
      sessao.gravarConta(r.redirectUrl);
      trackContaCriada();
      setFase({ tipo: "sucesso" });
      window.setTimeout(() => irPara("ramo", { replace: true }), ESPERA_SUCESSO_MS);
    } else {
      trackErroCriacao(r.code);
      setFase({ tipo: "erro", code: r.code });
    }
  }, []);

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
          <p>Seu teste grátis de {DURACAO_TESTE} começa agora.</p>
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
        <h1 className={e.titulo}>Esse e-mail já tem conta no ady.</h1>
        <p className={e.apoio}>Entre com o seu e-mail para continuar de onde parou.</p>
        <div className={e.acoes}>
          {/* TODO(contrato): URL de login do app (NEXT_PUBLIC_ADY_APP_LOGIN_URL). */}
          {APP_LOGIN_URL ? (
            <a href={APP_LOGIN_URL} className={`lp-cta lp-cta--wide ${e.botao}`}>
              Entrar
            </a>
          ) : null}
          <a href={caminho("lp", "#cadastro")} className={e.secundario}>
            Usar outro e-mail
          </a>
        </div>
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
