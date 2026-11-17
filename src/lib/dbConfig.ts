import type { PoolConfig } from "pg";

/**
 * Configuração do acesso ao Postgres de `DATABASE_URL`. Só lógica pura,
 * sem abrir conexão: é importada também pelo `next.config.ts` (pra
 * recusar o build com configuração errada) e pelos testes.
 *
 * - `DATABASE_DRIVER=neon` (padrão, ou vazia): driver HTTP do Neon.
 * - `DATABASE_DRIVER=pg`: driver `pg` por TCP, com pool pequeno. Na Vercel
 *   exige `DATABASE_CA_CERT` (PEM do certificado do servidor) e o TLS é
 *   sempre verificado contra ele. Fora da Vercel, sem o CA, conecta sem
 *   TLS (Postgres local do docker-compose.yml).
 *
 * Voltar pro Neon é só trocar a variável (e o `DATABASE_URL`) e redeployar.
 */

export type DriverBanco = "neon" | "pg";

export class ConfiguracaoBancoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfiguracaoBancoError";
  }
}

type Env = Record<string, string | undefined>;

/** Rodando na Vercel (produção ou preview). */
export function naVercel(env: Env = process.env): boolean {
  return Boolean(env.VERCEL);
}

export function driverBanco(env: Env = process.env): DriverBanco {
  const valor = (env.DATABASE_DRIVER ?? "").trim().toLowerCase();
  if (valor === "" || valor === "neon") return "neon";
  if (valor === "pg") return "pg";
  // Erro de digitação não pode cair calado no driver errado.
  throw new ConfiguracaoBancoError(`DATABASE_DRIVER inválida: use "neon" ou "pg".`);
}

/** Parâmetros de TLS da connection string. Com `pg` eles sobrescrevem o
 * objeto `ssl` do pool (e anulariam o CA), então saem da URL: o TLS é
 * decidido só por `opcoesSsl`. */
const PARAMETROS_SSL = [
  "ssl",
  "sslmode",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "sslnegotiation",
  "uselibpqcompat",
];

export function urlSemSsl(connectionString: string): string {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    // Nunca repassar a URL na mensagem: ela tem a senha.
    throw new ConfiguracaoBancoError("DATABASE_URL não é uma URL válida.");
  }
  for (const nome of PARAMETROS_SSL) url.searchParams.delete(nome);
  return url.toString();
}

/** PEM de `DATABASE_CA_CERT`. Aceita o `\n` escrito literalmente (como fica
 * quando o certificado é colado numa linha só). */
export function caDoBanco(env: Env = process.env): string | null {
  const bruto = env.DATABASE_CA_CERT?.trim();
  if (!bruto) return null;
  const pem = bruto.replace(/\\n/g, "\n");
  if (!pem.includes("-----BEGIN CERTIFICATE-----")) {
    throw new ConfiguracaoBancoError("DATABASE_CA_CERT não parece um certificado PEM.");
  }
  return pem;
}

export function opcoesSsl(env: Env = process.env): PoolConfig["ssl"] {
  const ca = caDoBanco(env);
  if (ca) return { ca, rejectUnauthorized: true };
  if (naVercel(env)) {
    throw new ConfiguracaoBancoError(
      "DATABASE_DRIVER=pg na Vercel exige DATABASE_CA_CERT (PEM do certificado do Postgres).",
    );
  }
  return false;
}

/** Pool pequeno pra funções serverless: poucas conexões por instância e
 * ociosas fechadas logo (o `attachDatabasePool` cuida da suspensão). */
export function configPool(connectionString: string, env: Env = process.env): PoolConfig {
  return {
    connectionString: urlSemSsl(connectionString),
    ssl: opcoesSsl(env),
    max: 3,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 5_000,
    query_timeout: 10_000,
    statement_timeout: 10_000,
    keepAlive: true,
    allowExitOnIdle: true,
    application_name: "ady-site",
  };
}

/**
 * Checagem de inicialização (chamada no `next.config.ts`): com `pg` na
 * Vercel, sem CA o build falha em vez de subir uma versão que não conecta.
 */
export function verificarConfigBanco(env: Env = process.env): void {
  if (driverBanco(env) === "pg") opcoesSsl(env);
}

/** Texto parametrizado (`$1`, `$2`...) a partir das partes de uma template
 * string — o que o driver do Neon faz por dentro com `` sql`...` ``. */
export function montarTexto(partes: readonly string[]): string {
  return partes.reduce((texto, parte, i) => `${texto}$${i}${parte}`);
}
