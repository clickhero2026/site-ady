"use client";

import { cloneElement, useEffect, useId, useRef, useState } from "react";
import { useLeadModal } from "./LeadModalContext";
import { SEGMENTOS, PLANOS, type PlanoKey } from "@/lib/leadOptions";
import { formatPhone, isValidPhone } from "@/lib/phoneMask";
import { saveLastLead } from "@/lib/lastLeadStorage";
import styles from "./LeadModal.module.css";

interface FormState {
  nome: string;
  whatsapp: string;
  negocio: string;
  segmento: string;
  plano: PlanoKey;
}

const EMPTY_FORM: FormState = {
  nome: "",
  whatsapp: "",
  negocio: "",
  segmento: "",
  plano: "indeciso",
};

type Status = "idle" | "submitting" | "error";

export function LeadModal() {
  const { isOpen, plan, close } = useLeadModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reseta o formulário e sincroniza o plano sempre que o modal transiciona
  // de fechado pra aberto. De propósito durante a renderização (não em
  // useEffect) — é o padrão que o React recomenda pra "ajustar estado quando
  // uma prop muda", sem o round-trip extra de um efeito.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setForm({ ...EMPTY_FORM, plano: plan ?? "indeciso" });
      setErrors({});
      setStatus("idle");
      setErrorMessage(null);
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (form.nome.trim().length < 2) next.nome = "Digite seu nome completo.";
    if (!isValidPhone(form.whatsapp)) {
      next.whatsapp = "Digite um WhatsApp válido, com DDD.";
    }
    if (form.negocio.trim().length < 2) {
      next.negocio = "Digite o nome do seu negócio.";
    }
    if (!form.segmento) next.segmento = "Escolha um segmento.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          whatsapp: form.whatsapp,
          negocio: form.negocio,
          segmento: form.segmento,
          plano: form.plano,
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

      // Bitrix está fora do ar (webhook exige plano pago) — o WhatsApp é
      // o canal efetivo de contato agora, não um extra. Guarda os dados
      // que a pessoa acabou de digitar pra /obrigado montar a mensagem
      // personalizada (ver src/lib/lastLeadStorage.ts).
      saveLastLead({
        nome: form.nome,
        negocio: form.negocio,
        segmento: form.segmento,
        planoLabel: PLANOS[form.plano],
      });

      // Navegação completa (não client-side router.push) de propósito:
      // garante que /obrigado carrega do zero, pra base do Meta Pixel e do
      // Google Tag Manager disparar de forma confiável (Etapa 4). Pedido
      // explícito — não trocar por useRouter().push() sem confirmar com o
      // Rafael.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/obrigado";
    } catch {
      setStatus("error");
      setErrorMessage(
        "Não deu pra enviar agora. Confere sua internet e tenta de novo.",
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={close}
      onCancel={close}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={close}
          aria-label="Fechar"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>

        <h2 id={titleId} className={styles.title}>
          Quero o ady no meu negócio
        </h2>
        <p className={styles.lead}>
          Preenche seus dados e a gente conecta seu ady pelo WhatsApp.
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <Field label="Nome" error={errors.nome}>
            <input
              type="text"
              autoComplete="name"
              autoFocus
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

          <Field label="Nome do negócio" error={errors.negocio}>
            <input
              type="text"
              autoComplete="organization"
              value={form.negocio}
              onChange={(e) => handleField("negocio", e.target.value)}
              aria-invalid={Boolean(errors.negocio)}
            />
          </Field>

          <Field label="Segmento" error={errors.segmento}>
            <select
              value={form.segmento}
              onChange={(e) => handleField("segmento", e.target.value)}
              aria-invalid={Boolean(errors.segmento)}
            >
              <option value="" disabled>
                Escolha uma opção
              </option>
              {SEGMENTOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Plano de interesse">
            <select
              value={form.plano}
              onChange={(e) => handleField("plano", e.target.value as PlanoKey)}
            >
              {(Object.keys(PLANOS) as PlanoKey[]).map((key) => (
                <option key={key} value={key}>
                  {PLANOS[key]}
                </option>
              ))}
            </select>
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
            </p>
          )}

          <button
            type="submit"
            className={styles.submit}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Enviando…" : "Quero o ady no meu negócio"}
          </button>
        </form>
      </div>
    </dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement<{
    id?: string;
    "aria-describedby"?: string;
  }>;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}</span>
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
