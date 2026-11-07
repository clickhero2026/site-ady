/**
 * Proteção da nossa rota /api/fluxo-b/signup (a API do app não tem).
 * Sem imports: o teste em `protecao.test.mjs` roda com `node --test`.
 */

/**
 * Limite em memória por chave (janela deslizante). MELHOR ESFORÇO: em
 * serverless (Vercel) cada instância tem a sua memória e ela some quando a
 * instância é reciclada, então o limite real pode ser maior que o
 * configurado. Para limite global, trocar por um armazenamento
 * compartilhado (ex.: Postgres/Redis) — mesma interface.
 */
export function criarLimitador({ max, janelaMs, maxChaves = 10_000 }: { max: number; janelaMs: number; maxChaves?: number }) {
  const hits = new Map<string, number[]>();

  function limpar(agora: number) {
    for (const [chave, lista] of hits) {
      const vivos = lista.filter((t) => agora - t < janelaMs);
      if (vivos.length) hits.set(chave, vivos);
      else hits.delete(chave);
    }
  }

  return {
    /** Registra uma tentativa; false = passou do limite (não registra). */
    tentar(chave: string, agora: number = Date.now()): boolean {
      if (hits.size >= maxChaves) limpar(agora);
      if (hits.size >= maxChaves) hits.delete(hits.keys().next().value as string); // ainda cheio: sai o mais antigo
      const vivos = (hits.get(chave) ?? []).filter((t) => agora - t < janelaMs);
      if (vivos.length >= max) {
        hits.set(chave, vivos);
        return false;
      }
      vivos.push(agora);
      hits.set(chave, vivos);
      return true;
    },
    /** Devolve a última tentativa (ex.: a API do app falhou por rede). */
    liberar(chave: string) {
      const lista = hits.get(chave);
      if (!lista?.length) return;
      lista.pop();
      if (!lista.length) hits.delete(chave);
    },
    /** Segundos até a próxima tentativa liberada (cabeçalho Retry-After). */
    esperaSegundos(chave: string, agora: number = Date.now()): number {
      const vivos = (hits.get(chave) ?? []).filter((t) => agora - t < janelaMs);
      if (vivos.length < max) return 0;
      return Math.max(1, Math.ceil((vivos[0] + janelaMs - agora) / 1000));
    },
    tamanho: () => hits.size,
  };
}

export const LIMITE_IP = { max: 5, janelaMs: 10 * 60 * 1000 } as const;
export const LIMITE_EMAIL = { max: 1, janelaMs: 60 * 1000 } as const;

/**
 * A requisição veio de uma página nossa? Exige `Origin` (o navegador
 * sempre manda em POST) com o MESMO host do `Host`, e esse host na lista:
 * - host próprio do Fluxo B (+ extras);
 * - fora de produção: o host do deploy de preview (VERCEL_URL /
 *   VERCEL_BRANCH_URL) e localhost/127.0.0.1.
 * Sem `Origin` (curl, servidor) → recusa.
 */
export function origemPermitidaNaRota(req: {
  origin: string | null;
  host: string | null;
  vercelEnv?: string;
  hostsFluxoB: readonly string[];
  hostsPreview?: readonly (string | undefined)[];
}): boolean {
  if (!req.origin || !req.host) return false;
  let origem: URL;
  try {
    origem = new URL(req.origin);
  } catch {
    return false;
  }
  if (origem.username || origem.password) return false;
  const host = req.host.toLowerCase();
  if (origem.host.toLowerCase() !== host) return false;

  const hostname = host.split(":")[0];
  if (req.hostsFluxoB.map((h) => h.toLowerCase()).includes(hostname)) return true;
  if (req.vercelEnv === "production") return false;

  const previews = (req.hostsPreview ?? []).filter(Boolean).map((h) => (h as string).toLowerCase());
  if (previews.includes(hostname)) return true;
  return hostname === "localhost" || hostname === "127.0.0.1";
}
