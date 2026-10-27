"use client";

import { useSyncExternalStore } from "react";
import styles from "./Agendar.module.css";

/** Onde /agendar guarda o horário — só quando o evento do Calendly traz. */
export const HORARIO_STORAGE_KEY = "ady:t7d:horario";

function lerHorario(): string | null {
  try {
    const iso = sessionStorage.getItem(HORARIO_STORAGE_KEY);
    if (!iso) return null;
    const data = new Date(iso);
    if (Number.isNaN(data.getTime())) return null;
    return data.toLocaleString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

const nada = () => () => {};

/**
 * Horário da conversa, se veio no evento do Calendly. Hoje o evento do
 * navegador não traz — então, na prática, nada aparece. Sem consultar o
 * banco e sem supor horário.
 */
export function HorarioMarcado() {
  const horario = useSyncExternalStore(nada, lerHorario, () => null);
  if (!horario) return null;
  return (
    <p className={styles.horario}>
      Sua conversa: <strong>{horario}</strong>
    </p>
  );
}
