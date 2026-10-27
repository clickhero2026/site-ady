"use client";

import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TESTE7D } from "@/config/teste7d";
import { trackTeste7dSchedule } from "@/lib/analytics";
import { HORARIO_STORAGE_KEY } from "./HorarioMarcado";
import styles from "./Agendar.module.css";

type CalendlyGlobal = {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement; resize?: boolean }) => void;
};

/**
 * Calendly embutido (inline). Quando o Calendly avisa que a conversa foi
 * marcada (`calendly.event_scheduled`, por postMessage), grava na nossa
 * API, dispara o Schedule no GTM e vai pra /obrigado.
 *
 * A conversa já está marcada no Calendly nesse momento: se a nossa API
 * falhar (mesmo depois de tentar de novo), a pessoa segue pra /obrigado
 * do mesmo jeito — o erro fica no log, e o status no banco pode ser
 * corrigido pelo time.
 *
 * O evento do Calendly no navegador não traz o horário (só os links do
 * evento). Se um dia trouxer (`payload.event.start_time`), ele é guardado
 * pra /obrigado mostrar — nunca suposto nem consultado no banco.
 */
export function AgendarCalendly({
  url,
  dev,
  prefill,
}: {
  url: string | undefined;
  dev: boolean;
  prefill: { nome: string; email: string; whatsapp: string };
}) {
  const alvo = useRef<HTMLDivElement>(null);
  const registrando = useRef(false);
  const [registrandoEstado, setRegistrandoEstado] = useState(false);

  const urlComDados = useMemo(() => {
    if (!url) return null;
    try {
      const u = new URL(url);
      u.searchParams.set("name", prefill.nome);
      u.searchParams.set("email", prefill.email);
      u.searchParams.set(TESTE7D.calendlyTelefoneParam, `+${prefill.whatsapp}`);
      u.searchParams.set("hide_gdpr_banner", "1");
      return u.toString();
    } catch {
      return null;
    }
  }, [url, prefill]);

  const registrar = useCallback(async (eventoUri: string, inicio?: string) => {
    if (registrando.current) return;
    registrando.current = true;
    setRegistrandoEstado(true);

    try {
      if (inicio) sessionStorage.setItem(HORARIO_STORAGE_KEY, inicio);
      else sessionStorage.removeItem(HORARIO_STORAGE_KEY);
    } catch {
      // sem sessionStorage: /obrigado só não mostra o horário
    }

    let eventId: string | null = null;
    for (let tentativa = 0; tentativa < 2 && !eventId; tentativa++) {
      try {
        const res = await fetch("/api/teste7d/agendamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ calendly_evento_uri: eventoUri }),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.ok) eventId = json.eventId;
        else console.error("[agendar] API recusou o agendamento:", res.status, json.error);
      } catch (err) {
        console.error("[agendar] Falha de rede ao registrar o agendamento:", err);
      }
    }

    let foi = false;
    const seguir = () => {
      if (foi) return;
      foi = true;
      window.location.assign(TESTE7D.paginas.obrigado);
    };
    if (eventId) trackTeste7dSchedule(eventId, seguir);
    window.setTimeout(seguir, eventId ? 2500 : 0);
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string; payload?: { event?: { uri?: string; start_time?: string } } };
      if (data?.event !== "calendly.event_scheduled") return;
      const uri = data.payload?.event?.uri;
      if (uri) void registrar(uri, data.payload?.event?.start_time);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [registrar]);

  const iniciarWidget = useCallback(() => {
    const calendly = (window as unknown as { Calendly?: CalendlyGlobal }).Calendly;
    if (calendly && alvo.current && urlComDados && !alvo.current.childElementCount) {
      // resize: o Calendly avisa a altura da página dele (calendly.page_height)
      // e o widget ajusta a caixa — sem rolagem dentro da rolagem.
      calendly.initInlineWidget({ url: urlComDados, parentElement: alvo.current, resize: true });
    }
  }, [urlComDados]);

  if (!urlComDados) {
    return dev ? (
      <div className={styles.avisoDev} role="alert">
        <strong>Só em desenvolvimento:</strong> <code>NEXT_PUBLIC_CALENDLY_URL</code> não está configurada (ou não é uma
        URL válida), então a agenda não aparece.
        <BotaoSimular onSimular={registrar} desativado={registrandoEstado} />
      </div>
    ) : (
      <p className={styles.erroAgenda} role="alert">
        Não conseguimos carregar a agenda agora. Tente de novo em instantes.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={iniciarWidget}
      />
      <div
        ref={alvo}
        role="region"
        className={styles.calendly}
        aria-label="Agenda com os horários disponíveis"
      />
      {registrandoEstado && (
        <p className={styles.registrando} role="status">
          Conversa marcada! Só um instante…
        </p>
      )}
      {dev && <BotaoSimular onSimular={registrar} desativado={registrandoEstado} />}
    </>
  );
}

/** Só desenvolvimento: simula o `calendly.event_scheduled` pra testar o fluxo. */
function BotaoSimular({
  onSimular,
  desativado,
}: {
  onSimular: (uri: string) => void;
  desativado: boolean;
}) {
  return (
    <button
      type="button"
      className={styles.simular}
      disabled={desativado}
      onClick={() => onSimular(`https://api.calendly.com/scheduled_events/DEV-${crypto.randomUUID()}`)}
    >
      Simular agendamento (só em desenvolvimento)
    </button>
  );
}
