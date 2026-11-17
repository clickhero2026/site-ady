// Rodar: node --test src/lib/dbConfig.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ConfiguracaoBancoError,
  configPool,
  driverBanco,
  montarTexto,
  opcoesSsl,
  urlSemSsl,
  verificarConfigBanco,
} from "./dbConfig.ts";

const PEM = "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----";
const URL_PG = "postgres://app:s%40nha@185.111.156.157:5432/ady?sslmode=require&application_name=x";

test("driver: padrão neon; aceita pg e neon sem diferenciar maiúsculas", () => {
  assert.equal(driverBanco({}), "neon");
  assert.equal(driverBanco({ DATABASE_DRIVER: "" }), "neon");
  assert.equal(driverBanco({ DATABASE_DRIVER: " Neon " }), "neon");
  assert.equal(driverBanco({ DATABASE_DRIVER: "PG" }), "pg");
});

test("driver desconhecido é erro, não cai calado no Neon", () => {
  assert.throws(() => driverBanco({ DATABASE_DRIVER: "postgres" }), ConfiguracaoBancoError);
});

test("parâmetros ssl saem da URL; o resto (e a senha codificada) fica", () => {
  const url = urlSemSsl(`${URL_PG}&sslrootcert=/x.pem&uselibpqcompat=true&ssl=true`);
  assert.equal(url, "postgres://app:s%40nha@185.111.156.157:5432/ady?application_name=x");
});

test("URL inválida não vaza no erro", () => {
  assert.throws(
    () => urlSemSsl("//app:senha-secreta@host"),
    (e) => e instanceof ConfiguracaoBancoError && !e.message.includes("senha-secreta"),
  );
});

test("com CA: TLS verificado contra ele; \\n literal vira quebra de linha", () => {
  const ssl = opcoesSsl({ VERCEL: "1", DATABASE_CA_CERT: PEM.replace(/\n/g, "\\n") });
  assert.deepEqual(ssl, { ca: PEM, rejectUnauthorized: true });
});

test("CA que não é PEM é recusado", () => {
  assert.throws(() => opcoesSsl({ DATABASE_CA_CERT: "abc" }), ConfiguracaoBancoError);
});

test("na Vercel sem CA: recusa", () => {
  assert.throws(() => opcoesSsl({ VERCEL: "1" }), /DATABASE_CA_CERT/);
});

test("fora da Vercel sem CA: sem TLS (Postgres local)", () => {
  assert.equal(opcoesSsl({}), false);
});

test("verificarConfigBanco: só cobra o CA com pg", () => {
  assert.doesNotThrow(() => verificarConfigBanco({ VERCEL: "1" }));
  assert.doesNotThrow(() => verificarConfigBanco({ VERCEL: "1", DATABASE_DRIVER: "neon" }));
  assert.throws(() => verificarConfigBanco({ VERCEL: "1", DATABASE_DRIVER: "pg" }), ConfiguracaoBancoError);
  assert.doesNotThrow(() => verificarConfigBanco({ VERCEL: "1", DATABASE_DRIVER: "pg", DATABASE_CA_CERT: PEM }));
});

test("pool pequeno pra serverless, sem sslmode na URL", () => {
  const cfg = configPool(URL_PG, { DATABASE_CA_CERT: PEM });
  assert.equal(cfg.max, 3);
  assert.equal(cfg.idleTimeoutMillis, 5000);
  assert.equal(cfg.connectionTimeoutMillis, 5000);
  assert.equal(cfg.statement_timeout, 10000);
  assert.equal(cfg.query_timeout, 10000);
  assert.ok(!cfg.connectionString.includes("sslmode"));
  assert.deepEqual(cfg.ssl, { ca: PEM, rejectUnauthorized: true });
});

test("montarTexto numera os parâmetros como o driver do Neon", () => {
  const partes = (s, ...v) => [s, v];
  const [s] = partes`SELECT * FROM t WHERE a = ${1} AND b > now() - make_interval(mins => ${2})`;
  assert.equal(montarTexto(s), "SELECT * FROM t WHERE a = $1 AND b > now() - make_interval(mins => $2)");
  assert.equal(montarTexto(["SELECT 1"]), "SELECT 1");
});
