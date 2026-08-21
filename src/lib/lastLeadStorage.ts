/**
 * Carrega os dados do lead que acabou de se inscrever da home, do
 * `LeadModal` até a página `/obrigado` — que são duas navegações
 * separadas (a segunda é um `window.location.href` de propósito, pro GTM
 * disparar de forma confiável), então não dá pra passar isso por estado
 * do React.
 *
 * Usa `sessionStorage`, não query string: os dados (nome, negócio) não
 * aparecem na URL, no histórico do navegador nem em nenhum log de acesso.
 * Some sozinho quando a aba fecha, e é lido uma única vez.
 */

const STORAGE_KEY = "ady:lastLead";

export interface LastLead {
  nome: string;
  negocio: string;
  segmento: string;
  planoLabel: string;
}

export function saveLastLead(lead: LastLead) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
  } catch {
    // sessionStorage indisponível (ex. modo privado restrito) — sem
    // problema, /obrigado só cai pra mensagem genérica de WhatsApp.
  }
}

/** Lê e apaga na hora — uso único, não deve sobreviver a um refresh manual
 * da página /obrigado (senão reaparece a mensagem de um lead antigo). */
export function readAndClearLastLead(): LastLead | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as LastLead;
  } catch {
    return null;
  }
}
