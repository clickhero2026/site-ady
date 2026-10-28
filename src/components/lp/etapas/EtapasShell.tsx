import { CalendarClock, Check, CreditCard, Handshake } from "lucide-react";
import type { ReactNode } from "react";
import { LpLogo } from "../LpLogo";
import styles from "./EtapasShell.module.css";

const PASSOS = ["Inscrição feita", "Sobre o seu negócio", "Escolher o horário"] as const;

/**
 * Casca das páginas depois da inscrição (/ativacao, /agendar, /obrigado):
 * painel petróleo à esquerda no desktop (vira cabeçalho compacto no
 * celular) e o conteúdo à direita, com a barra de progresso real.
 *
 * `passo`: o passo em andamento (2 ou 3). `concluido` marca o passo 3
 * como feito, na página /obrigado.
 */
export function EtapasShell({
  passo,
  concluido = false,
  saudacao,
  saudacaoTitulo = false,
  children,
}: {
  passo: 2 | 3;
  concluido?: boolean;
  saudacao: string;
  /** Página sem H1 próprio (ativação): a saudação vira o H1. */
  saudacaoTitulo?: boolean;
  children: ReactNode;
}) {
  const Saudacao = saudacaoTitulo ? "h1" : "p";
  return (
    <div className={styles.shell}>
      <aside className={styles.painel}>
        <LpLogo inverse />
        <p className={styles.painelTitulo}>Falta pouco para liberar o seu teste de 7 dias</p>
        <ul className={styles.confianca}>
          <li>
            <CreditCard aria-hidden="true" size={24} strokeWidth={2} />
            Sem cartão de crédito
          </li>
          <li>
            <CalendarClock aria-hidden="true" size={24} strokeWidth={2} />
            Os 7 dias só começam depois da ativação da sua conta
          </li>
          <li>
            <Handshake aria-hidden="true" size={24} strokeWidth={2} />
            A gente configura com você
          </li>
        </ul>
      </aside>

      <main id="conteudo" className={styles.conteudo}>
        <div className={styles.conteudoInner}>
          <Saudacao className={styles.saudacao}>{saudacao}</Saudacao>

          <nav aria-label="Progresso" className={styles.progresso}>
            <p className={styles.passoTexto}>
              Passo {concluido ? 3 : passo} de 3
            </p>
            <ol className={styles.passos}>
              {PASSOS.map((nome, i) => {
                const n = i + 1;
                const feito = n < passo || (concluido && n === 3);
                const atual = n === passo && !concluido;
                return (
                  <li
                    key={nome}
                    className={styles.passo}
                    data-feito={feito || undefined}
                    data-atual={atual || undefined}
                    aria-current={atual ? "step" : undefined}
                  >
                    <span className={styles.passoMarca} aria-hidden="true">
                      {feito ? <Check size={16} strokeWidth={3} /> : n}
                    </span>
                    <span className={styles.passoNome}>
                      {nome}
                      {feito && <span className="visually-hidden"> (feito)</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>

          {children}
        </div>
      </main>
    </div>
  );
}
