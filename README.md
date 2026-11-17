# site ady

Site institucional, LPs do teste grátis e workshop da ady (Next.js, na Vercel).

## Rodar local

```bash
npm install
cp .env.example .env.local   # preencher o que for usar
npm run dev                  # http://localhost:3000
```

## Banco de dados

Dois bancos, cada um com a sua variável:

| Variável | Tabela | Driver |
|---|---|---|
| `DATABASE_URL` | `teste7d_inscricoes` (teste grátis) | `DATABASE_DRIVER`: `neon` (padrão) ou `pg` |
| `WORKSHOP_DATABASE_URL` | `workshop_leads` (campanha desativada) | sempre Neon (`src/lib/workshopDb.ts`) |

`DATABASE_URL` passa por `src/lib/db.ts`, que expõe a mesma interface do
driver do Neon (`` sql`...` `` e `sql.query`) sobre os dois drivers. A
configuração fica em `src/lib/dbConfig.ts`:

- **`pg`** (Postgres 18 próprio no Easypanel): TCP com pool pequeno pra
  serverless (`max` 3, ociosa fecha em 5 s, timeout de conexão 5 s, timeout
  de consulta 10 s), `attachDatabasePool` da Vercel. O TLS é obrigatório na
  Vercel e verificado contra `DATABASE_CA_CERT` (PEM do certificado do
  servidor). `sslmode` e afins na URL são ignorados. Sem o CA, o build na
  Vercel falha (`next.config.ts`).
- **`neon`**: driver HTTP do Neon, como antes. Serve de rollback: voltar
  `DATABASE_DRIVER` pra `neon`, trocar o `DATABASE_URL` e redeployar.

### Postgres local

```bash
docker compose up -d   # Postgres 18 em localhost:54330; roda db/migrations na 1ª subida
```

No `.env.local`: `DATABASE_DRIVER=pg` e
`DATABASE_URL=postgres://postgres:postgres@localhost:54330/ady_site` (sem
CA: local conecta sem TLS).

Em produção, as migrations de `db/migrations` são aplicadas à mão, uma vez,
na ordem dos nomes.

## Verificações

```bash
npm run lint
npx tsc --noEmit
node --test src/lib/*.test.mjs src/lib/fluxo-b/*.test.mjs
npm run build
```
