export const THEME_STORAGE_KEY = "ady-theme";

export type Theme = "dark" | "light";

/**
 * Script inline, injetado no `<head>` via `beforeInteractive` (root
 * layout, `strategy="beforeInteractive"`). Roda antes do CSS renderizar,
 * então evita o flash do tema errado (FOUC) — lê a escolha salva e já
 * aplica `data-theme` no `<html>` antes do primeiro paint.
 *
 * Escuro é o default (briefing do toggle, seção 5: "isso não muda neste
 * momento") — só troca pra claro se o visitante já escolheu antes.
 * De propósito NÃO lê `prefers-color-scheme`: o padrão do produto é
 * escuro independente do SO do visitante, a escolha explícita do
 * localStorage é a única fonte de verdade além do default.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

type ThemeListener = () => void;

/**
 * Store mínima pra sincronizar `<ThemeToggle>` com o `data-theme` do
 * `<html>` — via `useSyncExternalStore` (não `useEffect` + `setState`):
 * é a API que o React recomenda pra ler estado que vive fora da árvore
 * React (o atributo no DOM, setado pelo script inline acima) sem
 * mismatch de hidratação. `getServerSnapshot` fixa "dark" pra bater com
 * o que o SSR e o `:root` de `globals.css` já assumem antes do script
 * inline rodar.
 */
const listeners = new Set<ThemeListener>();

export function subscribeTheme(listener: ThemeListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function getServerThemeSnapshot(): Theme {
  return "dark";
}

/** Aplica o tema no DOM, persiste em localStorage e avisa os toggles montados. */
export function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // localStorage indisponível (modo privado, cookies bloqueados) — a
    // escolha só não persiste entre visitas, o toggle continua
    // funcionando normalmente na sessão atual.
  }
  listeners.forEach((listener) => listener());
}
