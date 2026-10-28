"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent } from "react";
import type { LpVariant } from "@/config/teste7d";
import { TESTE7D } from "@/config/teste7d";
import { trackTeste7dLead } from "@/lib/analytics";
import { formatPhone, isValidPhone, phoneDigits } from "@/lib/phoneMask";
import { captureArrival, readTracking } from "@/lib/teste7dTracking";
import { useVisivelComTeclado } from "@/lib/useVisivelComTeclado";
import { ErroCampo } from "./ErroCampo";
import styles from "./InscricaoForm.module.css";

type Campo = "nome" | "whatsapp" | "email" | "consentimento_lgpd";
type Erros = Partial<Record<Campo, string>>;

const ROTULOS: Record<Campo, string> = {
  nome: "Seu nome",
  whatsapp: "Seu WhatsApp",
  email: "Seu e-mail",
  consentimento_lgpd: "Consentimento",
};

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
  // Resumo dos erros pro leitor de tela (a região aria-live já existe na
  // página; só o texto muda). O contador força um texto novo a cada envio.
  const [resumo, setResumo] = useState("");
  const tentativas = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const hidratado = useHidratado();
  useVisivelComTeclado(formRef, botaoRef);

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
    const comErro = Object.keys(encontrados) as Campo[];
    if (comErro.length) {
      tentativas.current += 1;
      const lista = comErro.map((c) => ROTULOS[c]).join(", ");
      setResumo(
        `${comErro.length === 1 ? "Confira 1 campo" : `Confira ${comErro.length} campos`}: ${lista}.` +
          "\u00a0".repeat(tentativas.current % 2),
      );
      document.getElementById(`${id}-${comErro[0]}`)?.focus();
      return;
    }
    setResumo("");

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
    erros[campo] ? <ErroCampo id={`${id}-${campo}-erro`}>{erros[campo]}</ErroCampo> : null;

  // Enter/Ir nos dois primeiros campos passa pro próximo; no e-mail (o
  // último), envia — comportamento padrão do formulário.
  const proximo = (campo: Campo) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    document.getElementById(`${id}-${campo}`)?.focus();
  };

  return (
    // method="post": se algo der errado antes do JavaScript, os dados
    // nunca vão parar na URL (um GET colocaria nome e WhatsApp na barra).
    <form
      ref={formRef}
      className={styles.form}
      method="post"
      onSubmit={onSubmit}
      noValidate
      aria-label="Inscrição no teste grátis de 7 dias"
    >
      <div className={styles.campos}>
        <div className={styles.campo} data-campo>
          <label htmlFor={`${id}-nome`}>Seu nome</label>
          <input
            {...erroProps("nome")}
            name="nome"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            onKeyDown={proximo("whatsapp")}
            maxLength={120}
            required
          />
          {mensagemErro("nome")}
        </div>

        <div className={styles.campo} data-campo>
          <label htmlFor={`${id}-whatsapp`}>Seu WhatsApp</label>
          <input
            {...erroProps("whatsapp")}
            name="whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            enterKeyHint="next"
            onKeyDown={proximo("email")}
            placeholder="(85) 99999-9999"
            maxLength={15}
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
            required
          />
          {mensagemErro("whatsapp")}
        </div>

        <div className={styles.campo} data-campo>
          <label htmlFor={`${id}-email`}>Seu e-mail</label>
          <input
            {...erroProps("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
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

      {/* A linha inteira é o rótulo: toque em qualquer ponto marca a caixa
          (o link de dentro continua abrindo a política). */}
      <div data-campo>
        <label className={styles.consentimento}>
          <input {...erroProps("consentimento_lgpd")} name="consentimento_lgpd" type="checkbox" required />
          <span>
            Aceito receber o contato do ady sobre o teste, pelo WhatsApp e por e-mail, conforme a{" "}
            <a href={`${TESTE7D.siteOrigin}/privacidade`} target="_blank" rel="noopener noreferrer">
              política de privacidade
            </a>
            .
          </span>
        </label>
        {mensagemErro("consentimento_lgpd")}
      </div>

      {/* Os rótulos de todos os estados ocupam a mesma célula: o botão tem
          sempre o tamanho do maior, sem "pulo" ao trocar o texto. */}
      <button
        ref={botaoRef}
        type="submit"
        className={`lp-cta lp-cta--wide ${styles.botao}`}
        disabled={!hidratado || estado !== "livre"}
      >
        <span className={styles.rotulos}>
          <span data-ativo={estado === "livre"}>QUERO TESTAR GRÁTIS</span>
          <span data-ativo={estado === "enviando"}>
            <span className={styles.spinner} aria-hidden="true" />
            ENVIANDO…
          </span>
          <span data-ativo={estado === "sucesso"}>PRONTO!</span>
        </span>
      </button>

      <p className={styles.nota}>Sem cartão de crédito. Os 7 dias só começam depois da ativação da sua conta.</p>

      <div role="status" aria-live="polite" className={styles.status}>
        {resumo && <p className="visually-hidden">{resumo}</p>}
        {estado === "sucesso" && <p className={styles.sucesso}>Inscrição feita! Levando você para o próximo passo.</p>}
        {erroGeral && <ErroCampo id={`${id}-erro-geral`}>{erroGeral}</ErroCampo>}
      </div>
    </form>
  );
}
