"use client";

import { cloneElement, useId, useState } from "react";
import { formatPhone, isValidPhone } from "@/lib/phoneMask";
import { WORKSHOP_SEGMENTOS } from "@/lib/workshopLeadOptions";
import { WORKSHOP, WORKSHOP_WHATSAPP } from "@/config/workshop";
import { buildWhatsappLink } from "@/lib/whatsapp";
import styles from "./RegistrationForm.module.css";

const JEAN_FALLBACK_MESSAGE =
  "Oi Jean, tentei me inscrever no workshop pelo site mas deu erro. Pode me ajudar?";

interface FormState {
  nome: string;
  whatsapp: string;
  email: string;
  negocio: string;
  segmento: string;
  indicadoPor: string;
}

const EMPTY_FORM: FormState = {
  nome: "",
  whatsapp: "",
  email: "",
  negocio: "",
  segmento: "",
  indicadoPor: "",
};

type Status = "idle" | "submitting" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (form.nome.trim().length < 2) next.nome = "Digite seu nome completo.";
    if (!isValidPhone(form.whatsapp)) {
      next.whatsapp = "Digite um WhatsApp válido, com DDD.";
    }
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Digite um e-mail válido.";
    if (form.negocio.trim().length < 2) {
      next.negocio = "Digite o nome do seu negócio.";
    }
    if (!form.segmento) next.segmento = "Escolha uma opção.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/workshop-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          whatsapp: form.whatsapp,
          email: form.email,
          negocio: form.negocio,
          segmento: form.segmento,
          indicadoPor: form.indicadoPor,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(
          json.error ?? "Não deu pra enviar agora. Tenta de novo em instantes.",
        );
        return;
      }

      // Navegação completa (não client-side) de propósito: garante que
      // /workshop/obrigado carrega do zero, pro evento Lead do GTM
      // disparar de forma confiável (mesmo motivo do formulário da home).
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/workshop/obrigado";
    } catch {
      setStatus("error");
      setErrorMessage(
        "Não deu pra enviar agora. Confere sua internet e tenta de novo.",
      );
    }
  }

  const jeanFallbackLink = buildWhatsappLink(WORKSHOP_WHATSAPP, JEAN_FALLBACK_MESSAGE);

  return (
    <section id="inscricao" className="section">
      <div className="container">
        <h2 className="section-title">Garanta sua vaga</h2>
        <p className={`section-lead ${styles.lead}`}>
          {WORKSHOP.data}, {WORKSHOP.horario}. São {WORKSHOP.vagas} vagas e
          não tem gravação.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field label="Nome completo" error={errors.nome}>
            <input
              type="text"
              autoComplete="name"
              value={form.nome}
              onChange={(e) => handleField("nome", e.target.value)}
              aria-invalid={Boolean(errors.nome)}
            />
          </Field>

          <Field label="WhatsApp" error={errors.whatsapp}>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="(11) 91234-5678"
              value={form.whatsapp}
              onChange={(e) => handleField("whatsapp", formatPhone(e.target.value))}
              aria-invalid={Boolean(errors.whatsapp)}
            />
          </Field>

          <Field label="E-mail" error={errors.email}>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>

          <Field label="Nome do seu negócio" error={errors.negocio}>
            <input
              type="text"
              autoComplete="organization"
              value={form.negocio}
              onChange={(e) => handleField("negocio", e.target.value)}
              aria-invalid={Boolean(errors.negocio)}
            />
          </Field>

          <Field label="O que seu negócio faz" error={errors.segmento}>
            <select
              value={form.segmento}
              onChange={(e) => handleField("segmento", e.target.value)}
              aria-invalid={Boolean(errors.segmento)}
            >
              <option value="" disabled>
                Escolha uma opção
              </option>
              {WORKSHOP_SEGMENTOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Se alguém te indicou, coloque o nome aqui" optional>
            <input
              type="text"
              value={form.indicadoPor}
              onChange={(e) => handleField("indicadoPor", e.target.value)}
            />
          </Field>

          {/* Honeypot — invisível pra gente, alvo fácil pra bot. */}
          <input
            type="text"
            name="empresa_site"
            tabIndex={-1}
            autoComplete="off"
            className={styles.honeypot}
            aria-hidden="true"
          />

          {status === "error" && errorMessage && (
            <p role="alert" className={styles.formError}>
              {errorMessage}
              {jeanFallbackLink && (
                <>
                  {" "}
                  <a href={jeanFallbackLink} target="_blank" rel="noopener noreferrer">
                    Chamar o Jean no WhatsApp
                  </a>
                  .
                </>
              )}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={status === "submitting"}>
            {status === "submitting" ? "Enviando…" : "Quero minha vaga"}
          </button>

          <p className={styles.microcopy}>
            A gente só usa seu WhatsApp pra mandar o link e o lembrete do
            workshop.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactElement<{ id?: string; "aria-describedby"?: string }>;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>
        {label}
        {optional && <span className={styles.optional}> (opcional)</span>}
      </span>
      {cloneElement(children, {
        id,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <span id={errorId} className={styles.fieldError}>
          {error}
        </span>
      )}
    </label>
  );
}
