-- Tabela de inscrições do workshop (ady). Rodar uma vez no editor SQL do
-- Neon, dentro do banco novo criado especificamente pra isso (não o banco
-- do clickhero-site).
--
-- Guarda o dado bruto do formulário pra dar pra fazer follow-up de
-- lembrete depois (via API oficial do WhatsApp). Bitrix continua sendo
-- tentado em paralelo (best-effort) quando a credencial existir — esta
-- tabela é a fonte de verdade enquanto isso.

CREATE TABLE IF NOT EXISTS workshop_leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  negocio TEXT NOT NULL,
  segmento TEXT NOT NULL,
  -- Preenchido só quando segmento = "Outro" (o "indicado_por" desta turma
  -- foi removido — não estamos rastreando indicação, ago/2026).
  negocio_outro TEXT,

  -- "workshop-[DATA]" — qual turma, de src/config/workshop.ts.
  origem TEXT NOT NULL,

  -- Preenchido depois, quando o follow-up automático existir. Nulo até lá.
  lembrete_enviado_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS workshop_leads_created_at_idx
  ON workshop_leads (created_at);

-- Se a tabela já existia (CREATE TABLE acima é IF NOT EXISTS, então não
-- altera tabela já criada): rode este ALTER uma vez no editor SQL do Neon
-- pra adicionar a coluna nova em produção.
ALTER TABLE workshop_leads ADD COLUMN IF NOT EXISTS negocio_outro TEXT;
