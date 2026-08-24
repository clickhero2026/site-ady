"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getServerThemeSnapshot, getThemeSnapshot, setTheme, subscribeTheme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
  /** "floating": fundo mais opaco + blur, pra quando não há uma barra de
   *  header por baixo garantindo contraste (ver ThemeToggle.module.css). */
  variant?: "header" | "floating";
}

/**
 * Botão sol/lua, mesmo componente em todas as páginas (briefing do
 * toggle, seção 2). Sem opção "sistema" — só claro/escuro.
 */
export function ThemeToggle({ className, variant = "header" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[styles.toggle, variant === "floating" && styles.floating, className]
        .filter(Boolean)
        .join(" ")}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
