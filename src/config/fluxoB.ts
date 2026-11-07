/**
 * Config central do Fluxo B do teste grátis: LP clonada → "conta criada"
 * (POST no app) → ramo do negócio → [senha] → entrada direta no app.
 *
 * Isolado do fluxo atual (lp.useady.com.br → ativação → Calendly): nada
 * aqui é lido por ele, e nada dele é alterado por aqui.
 */

/** Host público do Fluxo B. PLACEHOLDER: o nome final e o domínio na
 * Vercel/DNS ainda vão ser confirmados. Hosts extras (ex. um preview com
 * domínio próprio) vão em `FLUXO_B_EXTRA_HOSTS`, separados por vírgula. */
export const FLUXO_B_HOST = "teste.useady.com.br";

import { AVISO_MOCK_IGNORADO, origensDeRedirect, resolverMock, type EstadoMock } from "@/lib/fluxo-b/regras";

/** Prefixo interno das rotas em `src/app/fluxo-b/`. No host próprio o
 * proxy tira o prefixo (`/criando` → `/fluxo-b/criando`); no preview da
 * Vercel o acesso é direto por `/fluxo-b`. */
export { FLUXO_B_PREFIX } from "@/lib/fluxo-b/regras";
export type { EstadoMock } from "@/lib/fluxo-b/regras";

/** Telas do fluxo, sem o prefixo. */
export const FLUXO_B_TELAS = {
  lp: "/",
  criando: "/criando",
  ramo: "/ramo",
  senha: "/senha",
  /** Só em modo mock: simula a chegada no app. */
  appMock: "/app-mock",
} as const;

export type FluxoBTela = keyof typeof FLUXO_B_TELAS;

/**
 * Duração do teste grátis exibida na LP. A LP atual não tem constante pra
 * isso — "7 dias" está escrito direto na copy (LpHero, LpHowTrial, FAQ,
 * metadata do layout, nome da campanha `teste7d`). Aqui só reaproveitamos
 * o mesmo valor; se a LP mudar, mudar aqui também.
 */
export const DURACAO_TESTE = "7 dias";

/** Valores da barra de progresso (sem número de passo na tela). */
export const PROGRESSO = { lp: 20, criando: 40, ramo: 70, senha: 90, app: 100 } as const;

/**
 * Ramos do negócio. A ativação atual (10 passos) não tem pergunta de ramo,
 * então vale a lista padrão do briefing do Fluxo B. Chave estável (vai pro
 * dataLayer) → texto da tela.
 */
export const RAMOS = {
  alimentacao: "Alimentação",
  beleza: "Beleza e estética",
  saude: "Saúde e bem-estar",
  comercio: "Comércio",
  servicos: "Serviços",
  educacao: "Educação",
  outro: "Outro",
} as const;

export type Ramo = keyof typeof RAMOS;

/** Tela de senha: desligada por padrão até o app aceitar gravar a senha.
 * NEXT_PUBLIC → entra no build; trocar exige novo deploy. */
export const SENHA_ATIVA = process.env.NEXT_PUBLIC_FLUXO_B_SENHA === "1";

/**
 * Modo de teste sem backend (NEXT_PUBLIC_FLUXO_B_MOCK=1): simula o signup
 * (e os erros, via `?mock=exists|invalid|network`) e "entra" numa página
 * de teste. IGNORADO em produção (VERCEL_ENV=production), com aviso.
 *
 * Só no servidor: o navegador não enxerga VERCEL_ENV, então as páginas
 * calculam aqui e passam o resultado pros componentes por prop.
 */
export function mockDoServidor(): EstadoMock {
  if (typeof window !== "undefined") {
    throw new Error("[fluxo-b] mockDoServidor() é só do servidor; passe o resultado por prop.");
  }
  const estado = resolverMock({ mock: process.env.NEXT_PUBLIC_FLUXO_B_MOCK, vercelEnv: process.env.VERCEL_ENV });
  if (estado.ignorado) console.warn(AVISO_MOCK_IGNORADO);
  return estado;
}

/**
 * O que as telas (cliente) precisam saber do servidor. O navegador não
 * enxerga VERCEL_ENV nem FLUXO_B_REDIRECT_ORIGINS: as páginas chamam
 * isto e passam por prop. Páginas estáticas → valor do build (trocar a
 * env pede novo deploy).
 */
export type ConfigCliente = { mock: EstadoMock; origensRedirect: string[] };

export function configDoServidor(): ConfigCliente {
  return {
    mock: mockDoServidor(),
    origensRedirect: origensDeRedirect({
      lista: process.env.FLUXO_B_REDIRECT_ORIGINS,
      vercelEnv: process.env.VERCEL_ENV,
    }),
  };
}

/** Tela de login do app (botão "Entrar" quando o e-mail já tem conta).
 * TODO(contrato): URL de login do app — o desenvolvedor do app define. */
export const APP_LOGIN_URL = process.env.NEXT_PUBLIC_ADY_APP_LOGIN_URL ?? "";

/** Tela de redefinição de senha do app (e-mail já cadastrado).
 * TODO(contrato): URL de redefinição — o desenvolvedor do app define.
 * Sem a env, o botão "Redefinir minha senha" some. */
export const APP_RESET_URL = process.env.NEXT_PUBLIC_ADY_APP_RESET_URL ?? "";

/** E-mail já cadastrado (tela "criando" e erro do formulário). */
export const TEXTO_EMAIL_EXISTENTE = {
  titulo: "Esse e-mail já tem conta no ady.",
  apoio: "Se você esqueceu a senha, é só criar uma nova.",
} as const;

/** Tempo-limite do signup, no navegador e no route handler. */
export const SIGNUP_TIMEOUT_MS = 15_000;
