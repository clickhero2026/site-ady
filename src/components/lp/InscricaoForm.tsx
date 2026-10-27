"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { LpVariant } from "@/config/teste7d";
import { TESTE7D } from "@/config/teste7d";
import { trackTeste7dLead } from "@/lib/analytics";
import { formatPhone, isValidPhone, phoneDigits } from "@/lib/phoneMask";
import { captureArrival, readTracking } from "@/lib/teste7dTracking";
import styles from "./InscricaoForm.module.css";

type Campo = "nome" | "whatsapp" | "email" | "consentimento_lgpd";
type Erros = Partial<Record<Campo, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const nada = () => () => {};

/** false no HTML do servidor, true depois que o React assume a página.
 * Antes disso o botão fica desativado: um clique cedo demais faria o
 * envio nativo do navegador, sem a nossa validação. */
export function useHidratado() {
  return useSyncExternalStore(nada, () => true, () => false);
}

/** Mesmas mensagens do `inscricaoSchema` — o servidor continua sendo quem
 * decide; isto só evita uma ida e volta pra erro óbvio. */
function validar(dados: { nome: string; whatsapp: string; email: string; consentimento: boolean }): Erros {
  const erros: Erros = {};
  if (dados.nome.trim().length < 2) erros.nome = "Digite seu nome completo.";
  const digits = phoneDigits(dados.whatsapp.replace(/^\+?55\s*/, ""));
  if (!isValidPhone(digits)) erros.whatsapp = "Digite um WhatsApp válido, com DDD.";
  if (!EMAIL_RE.test(dados.email.trim())) erros.email = "Digite um e-mail válido.";
  if (!dados.consentimento) {
    erros.consentimento_lgpd = "Para continuar, aceite o uso dos seus dados para o contato do teste.";
  }
  return erros;
}

/**
 * Formulário da etapa 1 (nome, WhatsApp, e-mail, consentimento). Depois do
 * OK da API: evento Lead no GTM (com o event_id da API) e navegação
 * full-page pra etapa 2 — só depois do GTM confirmar, ou de 2,5s se ele
 * não carregou.
 *
 * O botão trava no primeiro clique (ref, não só estado: dois cliques no
 * mesmo frame passariam pelo estado antigo) — a API pode criar lead
 * duplicado no Bitrix com dois envios em menos de 1s.
 */
export function InscricaoForm({ variant }: { variant: LpVariant }) {
  const id = useId();
  const enviando = useRef(false);
  const [estado, setEstado] = useState<"livre" | "enviando" | "sucesso">("livre");
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const hidratado = useHidratado();

  useEffect(() => {
    captureArrival();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;

    const form = new FormData(event.currentTarget);
    const dados = {
      nome: String(form.get("nome") ?? ""),
      whatsapp,
      email: String(form.get("email") ?? ""),
      consentimento: form.get("consentimento_lgpd") === "on",
    };

    const encontrados = validar(dados);
    setErros(encontrados);
    setErroGeral("");
    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }

    enviando.current = true;
    setEstado("enviando");

    const rastreio = readTracking();
    try {
      const res = await fetch("/api/teste7d/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.nome,
          whatsapp: dados.whatsapp,
          email: dados.email,
          consentimento_lgpd: true,
          utm_source: rastreio.utm_source,
          utm_medium: rastreio.utm_medium,
          utm_campaign: rastreio.utm_campaign,
          utm_content: rastreio.utm_content,
          utm_term: rastreio.utm_term,
          fbclid: rastreio.fbclid,
          referrer: rastreio.referrer,
          landing_url: rastreio.landing_url,
          lp_variant: variant,
          empresa_site: String(form.get("empresa_site") ?? ""),
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        const campo = json.campo as Campo | undefined;
        const mensagem: string = json.error ?? "Não deu para enviar agora. Tente de novo em instantes.";
        if (campo && ["nome", "whatsapp", "email", "consentimento_lgpd"].includes(campo)) {
          setErros({ [campo]: mensagem });
          document.getElementById(`${id}-${campo}`)?.focus();
        } else {
          setErroGeral(mensagem);
        }
        enviando.current = false;
        setEstado("livre");
        return;
      }

      setEstado("sucesso");
      const destino: string = json.proximaUrl ?? TESTE7D.paginas.ativacao;
      let foi = false;
      const seguir = () => {
        if (foi) return;
        foi = true;
        // Navegação full-page de propósito: a próxima página carrega do
        // zero e o GTM registra o page_view dela.
        window.location.assign(destino);
      };
      trackTeste7dLead(json.eventId, variant, seguir);
      window.setTimeout(seguir, 2500);
    } catch {
      setErroGeral("Sem conexão no momento. Confira sua internet e tente de novo.");
      enviando.current = false;
      setEstado("livre");
    }
  }

  const erroProps = (campo: Campo) => ({
    id: `${id}-${campo}`,
    "aria-invalid": Boolean(erros[campo]) || undefined,
    "aria-describedby": erros[campo] ? `${id}-${campo}-erro` : undefined,
  });

  const mensagemErro = (campo: Campo) =>
    erros[campo] ? (
      <p id={`${id}-${campo}-erro`} className={styles.erro}>
        {erros[campo]}
      </p>
    ) : null;

  return (
    // method="post": se algo der errado antes do JavaScript, os dados
    // nunca vão parar na URL (um GET colocaria nome e WhatsApp na barra).
    <form
      className={styles.form}
      method="post"
      onSubmit={onSubmit}
      noValidate
      aria-label="Inscrição no teste grátis de 7 dias"
    >
      <div className={styles.campos}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-nome`}>Seu nome</label>
          <input {...erroProps("nome")} name="nome" type="text" autoComplete="name" maxLength={120} required />
          {mensagemErro("nome")}
        </div>

        <div className={styles.campo}>
          <label htmlFor={`${id}-whatsapp`}>Seu WhatsApp</label>
          <input
            {...erroProps("whatsapp")}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(85) 99999-9999"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
            required
          />
          {mensagemErro("whatsapp")}
        </div>

        <div className={styles.campo}>
          <label htmlFor={`${id}-email`}>Seu e-mail</label>
          <input
            {...erroProps("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={180}
            required
          />
          {mensagemErro("email")}
        </div>
      </div>

      {/* Honeypot: fora da tela e fora do tab, pra humano nunca preencher. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-empresa_site`}>Site da empresa</label>
        <input id={`${id}-empresa_site`} name="empresa_site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.consentimento}>
        <input {...erroProps("consentimento_lgpd")} name="consentimento_lgpd" type="checkbox" required />
        <label htmlFor={`${id}-consentimento_lgpd`}>
          Aceito receber o contato do ady sobre o teste, pelo WhatsApp e por e-mail, conforme a{" "}
          <a href={`${TESTE7D.siteOrigin}/privacidade`} target="_blank" rel="noopener noreferrer">
            política de privacidade
          </a>
          .
        </label>
      </div>
      {mensagemErro("consentimento_lgpd")}

      <button type="submit" className="lp-cta lp-cta--wide" disabled={!hidratado || estado !== "livre"}>
        {estado === "enviando" && <span className={styles.spinner} aria-hidden="true" />}
        {estado === "livre" && "QUERO TESTAR GRÁTIS POR 7 DIAS"}
        {estado === "enviando" && "ENVIANDO…"}
        {estado === "sucesso" && "PRONTO! SÓ UM INSTANTE…"}
      </button>

      <p className={styles.nota}>Sem cartão de crédito. Os 7 dias só começam depois da conversa.</p>

      <div role="status" aria-live="polite" className={styles.status}>
        {estado === "sucesso" && <p className={styles.sucesso}>Inscrição feita! Levando você para o próximo passo.</p>}
        {erroGeral && <p className={styles.erroGeral}>{erroGeral}</p>}
      </div>
    </form>
  );
}
