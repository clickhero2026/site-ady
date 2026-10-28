-- Retomada do teste grátis por link (/ativar-conta?t=<token>) ou por
-- WhatsApp + e-mail (/ativar-conta). NÃO roda sozinho: colar no SQL
-- Editor do Neon e executar uma vez, depois de 20261027_teste7d_inscricoes.sql.
-- Só acrescenta colunas e um índice em teste7d_inscricoes.

ALTER TABLE teste7d_inscricoes
  ADD COLUMN IF NOT EXISTS token_retomada text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  ADD COLUMN IF NOT EXISTS ultima_retomada_em timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS teste7d_inscricoes_token_retomada_uidx
  ON teste7d_inscricoes (token_retomada);

-- Contador de tentativas erradas de retomada por WhatsApp + e-mail, por
-- cadastro: sobe quando um dos dois bate e o outro não; com muitas falhas
-- na janela (TESTE7D.retomadaLimite), a retomada desse cadastro fica
-- bloqueada até a janela passar. Zera numa retomada certa.
ALTER TABLE teste7d_inscricoes
  ADD COLUMN IF NOT EXISTS retomada_falhas integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS retomada_falhas_desde timestamptz;
