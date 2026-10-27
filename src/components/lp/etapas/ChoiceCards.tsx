import type { ReactNode } from "react";
import { ErroCampo } from "../ErroCampo";
import styles from "./Etapa2.module.css";

/**
 * Pergunta de escolha única em cartões grandes. Por baixo é um grupo de
 * rádios nativo: setas, Tab e leitor de tela funcionam sem nada extra.
 */
export function ChoiceCards({
  name,
  pergunta,
  nota,
  opcoes,
  valor,
  onChange,
  erro,
  erroId,
  children,
}: {
  name: string;
  pergunta: ReactNode;
  nota?: ReactNode;
  opcoes: Record<string, string>;
  valor: string | undefined;
  onChange: (valor: string) => void;
  erro?: string;
  erroId: string;
  children?: ReactNode;
}) {
  const notaId = `${name}-nota`;
  return (
    <fieldset
      className={styles.fieldset}
      aria-describedby={[nota ? notaId : null, erro ? erroId : null].filter(Boolean).join(" ") || undefined}
    >
      <legend className={styles.pergunta}>{pergunta}</legend>
      {nota && (
        <p id={notaId} className={styles.nota}>
          {nota}
        </p>
      )}
      <div className={styles.cartoes}>
        {Object.entries(opcoes).map(([chave, texto]) => (
          <label key={chave} className={styles.cartao}>
            <input
              type="radio"
              name={name}
              value={chave}
              checked={valor === chave}
              onChange={() => onChange(chave)}
              className={styles.radio}
            />
            <span className={styles.cartaoMarca} aria-hidden="true" />
            <span>{texto}</span>
          </label>
        ))}
      </div>
      {children}
      {erro && <ErroCampo id={erroId}>{erro}</ErroCampo>}
    </fieldset>
  );
}
