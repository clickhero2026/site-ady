"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { formatPhone, isValidPhone, phoneDigits } from "@/lib/phoneMask";
import { useVisivelComTeclado } from "@/lib/useVisivelComTeclado";
import { ErroCampo } from "../ErroCampo";
import { InscricaoForm, useHidratado } from "../InscricaoForm";
import form from "../InscricaoForm.module.css";
import styles from "./AtivarConta.module.css";

type Campo = "whatsapp" | "email";
type Erros = Partial<Record<Campo, string>>;

const ROTULOS: Record<Campo, string> = { whatsapp: "Seu WhatsApp", email: "Seu e-mail" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mesmas mensagens do formulário da LP — o servidor continua decidindo. */
function validar(whatsapp: string, email: string): Erros {
  const erros: Erros = {};
  if (!isValidPhone(phoneDigits(whatsapp.replace(/^\+?55\s*/, "")))) erros.whatsapp = "Digite um WhatsApp válido, com DDD.";
  if (!EMAIL_RE.test(email.trim())) erros.email = "Digite um e-mail válido.";
  return erros;
}

/**
 * Retomada por WhatsApp + e-mail (/ativar-conta). Mesmos campos, máscara e
 * atributos do formulário da LP. Achou: segue pra onde a pessoa parou
 * (navegação full-page, sem nenhum evento de rastreio — retomar não é
 * cadastro novo). Não achou: mensagem neutra, "Tentar de novo" ou "Fazer
 * um cadastro novo" — este mostra aqui mesmo o formulário curto da LP, já
 * com o WhatsApp e o e-mail digitados.
 */
export function AtivarContaForm() {
  const id = useId();
  const enviando = useRef(false);
  const [estado, setEstado] = useState<"livre" | "enviando" | "sucesso">("livre");
  const [modo, setModo] = useState<"retomar" | "cadastro">("retomar");
  const [erros, setErros] = useState<Erros>({});
  const [naoEncontrado, setNaoEncontrado] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [resumo, setResumo] = useState("");
  const tentativas = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const tituloCadastroRef = useRef<HTMLHeadingElement>(null);
  const hidratado = useHidratado();
  useVisivelComTeclado(formRef, botaoRef);

  const focar = (campo: Campo) => document.getElementById(`${id}-${campo}`)?.focus();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;

    const encontrados = validar(whatsapp, email);
    setErros(encontrados);
    setNaoEncontrado("");
    setErroGeral("");
    const comErro = Object.keys(encontrados) as Campo[];
    if (comErro.length) {
      tentativas.current += 1;
      setResumo(
        `${comErro.length === 1 ? "Confira 1 campo" : `Confira ${comErro.length} campos`}: ${comErro.map((c) => ROTULOS[c]).join(", ")}.` +
          " ".repeat(tentativas.current % 2),
      );
      focar(comErro[0]);
      return;
    }
    setResumo("");

    enviando.current = true;
    setEstado("enviando");
    try {
      const res = await fetch("/api/teste7d/retomar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, email }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok && typeof json.proximaUrl === "string") {
        setEstado("sucesso");
        window.location.assign(json.proximaUrl);
        return;
      }

      const mensagem: string = json.error ?? "Não deu para continuar agora. Tente de novo em instantes.";
      const campo = json.campo as Campo | undefined;
      if (campo === "whatsapp" || campo === "email") {
        setErros({ [campo]: mensagem });
        focar(campo);
      } else if (res.status === 404) {
        setNaoEncontrado(mensagem);
      } else {
        setErroGeral(mensagem);
      }
    } catch {
      setErroGeral("Sem conexão no momento. Confira sua internet e tente de novo.");
    }
    enviando.current = false;
    setEstado("livre");
  }

  function tentarDeNovo() {
    setNaoEncontrado("");
    setModo("retomar");
    requestAnimationFrame(() => focar("whatsapp"));
  }

  function cadastroNovo() {
    setModo("cadastro");
    // Foco no título do bloco novo, não num campo: no celular, focar um
    // campo abriria o teclado sozinho.
    requestAnimationFrame(() => tituloCadastroRef.current?.focus());
  }

  if (modo === "cadastro") {
    return (
      <section className={styles.cadastro} aria-labelledby={`${id}-cadastro`}>
        <h2 id={`${id}-cadastro`} ref={tituloCadastroRef} tabIndex={-1} className={styles.cadastroTitulo}>
          Fazer um cadastro novo
        </h2>
        <p className={styles.cadastroTexto}>
          Confira os dados abaixo. Depois a gente pergunta um pouco sobre o seu negócio e você escolhe o melhor horário.
        </p>
        <div className={styles.cartao}>
          <InscricaoForm variant={null} inicial={{ whatsapp, email }} />
        </div>
        <button type="button" className={styles.secundario} onClick={tentarDeNovo}>
          Já tenho cadastro: tentar de novo
        </button>
      </section>
    );
  }

  const erroProps = (campo: Campo) => ({
    id: `${id}-${campo}`,
    "aria-invalid": Boolean(erros[campo]) || undefined,
    "aria-describedby": erros[campo] ? `${id}-${campo}-erro` : undefined,
  });
  const mensagemErro = (campo: Campo) =>
    erros[campo] ? <ErroCampo id={`${id}-${campo}-erro`}>{erros[campo]}</ErroCampo> : null;

  const proximo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    focar("email");
  };

  return (
    <div className={styles.cartao}>
      <form
        ref={formRef}
        className={form.form}
        method="post"
        onSubmit={onSubmit}
        noValidate
        aria-label="Continuar a ativação da conta"
      >
        <div className={form.campos}>
          <div className={form.campo} data-campo>
            <label htmlFor={`${id}-whatsapp`}>Seu WhatsApp</label>
            <input
              {...erroProps("whatsapp")}
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              enterKeyHint="next"
              onKeyDown={proximo}
              placeholder="(85) 99999-9999"
              maxLength={15}
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
              required
            />
            {mensagemErro("whatsapp")}
          </div>

          <div className={form.campo} data-campo>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {mensagemErro("email")}
          </div>
        </div>

        {/* Rótulos na mesma célula: o botão não muda de tamanho ao enviar. */}
        <button
          ref={botaoRef}
          type="submit"
          className={`lp-cta lp-cta--wide ${form.botao}`}
          disabled={!hidratado || estado !== "livre"}
        >
          <span className={form.rotulos}>
            <span data-ativo={estado === "livre"}>CONTINUAR A MINHA ATIVAÇÃO</span>
            <span data-ativo={estado === "enviando"}>
              <span className={form.spinner} aria-hidden="true" />
              ENVIANDO…
            </span>
            <span data-ativo={estado === "sucesso"}>PRONTO!</span>
          </span>
        </button>

        <div role="status" aria-live="polite" className={form.status}>
          {resumo && <p className="visually-hidden">{resumo}</p>}
          {estado === "sucesso" && <p className={form.sucesso}>Encontramos! Levando você para onde parou.</p>}
          {erroGeral && <ErroCampo id={`${id}-erro-geral`}>{erroGeral}</ErroCampo>}
          {naoEncontrado && (
            <div className={styles.naoEncontrado}>
              <ErroCampo id={`${id}-nao-encontrado`}>{naoEncontrado}</ErroCampo>
              <div className={styles.acoes}>
                <button type="button" className={styles.secundario} onClick={tentarDeNovo}>
                  Tentar de novo
                </button>
                <button type="button" className={styles.secundario} onClick={cadastroNovo}>
                  Fazer um cadastro novo
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
