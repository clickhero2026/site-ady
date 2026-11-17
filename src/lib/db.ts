import { neon, neonConfig } from "@neondatabase/serverless";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";
import { configPool, driverBanco, montarTexto } from "./dbConfig";

/**
 * Cliente SQL do banco de `DATABASE_URL` (só no servidor), com a mesma
 * forma do driver do Neon: `` sql`... ${valor}` `` e
 * `sql.query(texto, valores)`, os dois devolvendo as linhas. O driver vem
 * de `DATABASE_DRIVER` (ver dbConfig.ts).
 *
 * O workshop (`WORKSHOP_DATABASE_URL`) não passa por aqui: continua no
 * Neon, direto em workshopDb.ts.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mesma tipagem de linha do driver do Neon
export type Linha = Record<string, any>;

export interface Sql {
  (partes: TemplateStringsArray, ...valores: unknown[]): Promise<Linha[]>;
  query(texto: string, valores?: unknown[]): Promise<Linha[]>;
}

/**
 * Só desenvolvimento com o driver do Neon: aponta pra um proxy HTTP local
 * (ex. http://127.0.0.1:4444/sql, imagem local-neon-http-proxy na frente
 * de um Postgres local). Com `DATABASE_DRIVER=pg` não precisa: o `pg` fala
 * direto com o Postgres do docker-compose.yml. Nunca configurar na Vercel.
 */
if (process.env.NEON_LOCAL_SQL_ENDPOINT) {
  neonConfig.fetchEndpoint = process.env.NEON_LOCAL_SQL_ENDPOINT;
}

/** Um pool por processo (o hot reload do dev não abre um novo a cada edição). */
const globalComPool = globalThis as typeof globalThis & { __adySitePools?: Map<string, Sql> };

function sqlPg(connectionString: string): Sql {
  const pool = new Pool(configPool(connectionString));

  // Conexão ociosa que cai (restart do Postgres, rede) emite "error" no
  // pool; sem ouvinte, isso derruba o processo. Só a mensagem: o objeto
  // de erro pode carregar a configuração da conexão.
  pool.on("error", (err) => {
    console.error("[db] Erro numa conexão ociosa do pool:", err.message);
  });

  // Na Vercel (Fluid compute), fecha as ociosas antes de a instância ser
  // suspensa, pra não deixar conexão pendurada no servidor. Fora dela, nada.
  attachDatabasePool(pool);

  const executar = async (texto: string, valores: unknown[] = []) =>
    (await pool.query<Linha>(texto, valores)).rows;

  const sql = ((partes: TemplateStringsArray, ...valores: unknown[]) =>
    executar(montarTexto(partes), valores)) as Sql;
  sql.query = executar;
  return sql;
}

export function clienteSql(connectionString: string): Sql {
  if (driverBanco() === "neon") return neon(connectionString) as unknown as Sql;

  const pools = (globalComPool.__adySitePools ??= new Map());
  let sql = pools.get(connectionString);
  if (!sql) {
    sql = sqlPg(connectionString);
    pools.set(connectionString, sql);
  }
  return sql;
}
