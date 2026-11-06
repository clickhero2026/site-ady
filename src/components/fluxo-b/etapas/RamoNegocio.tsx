"use client";

import { Check, UserRound } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { PROGRESSO, RAMOS, SENHA_ATIVA, type Ramo } from "@/config/fluxoB";
import { trackRamoConcluido } from "@/lib/fluxo-b/analytics";
import { entrarNoApp } from "@/lib/fluxo-b/entrarNoApp";
import { irPara } from "@/lib/fluxo-b/rotas";
import { primeiroNome, sessao } from "@/lib/fluxo-b/sessao";
import { useSessaoFluxoB } from "@/lib/fluxo-b/useSessao";
import { FalhaAoEntrar } from "./FalhaAoEntrar";
import { FluxoBShell } from "./FluxoBShell";
import e from "./etapas.module.css";
import styles from "./RamoNegocio.module.css";

/**
 * Tela 4 do Fluxo B — ramo do negócio (multisseleção). Só abre com a conta
 * já criada (flag da sessão); sem ela, volta pro formulário da LP.
 *
 * O ramo NÃO vai pro app (o corpo do signup é fechado): fica na sessão e
 * vai só pro dataLayer. Depois: senha (se a flag estiver ligada) ou
 * entrada direta no app.
 */
export function RamoNegocio() {
  const { lead, conta } = useSessaoFluxoB();
  const id = useId();
  const [marcados, setMarcados] = useState<Ramo[]>([]);
  const [estado, setEstado] = useState<"livre" | "enviando" | "falhou">("livre");
  const enviando = useRef(false);

  useEffect(() => {
    if (conta === undefined) return;
    if (!conta?.criada) irPara("lp", { hash: "#cadastro", replace: true });
  }, [conta]);

  function alternar(ramo: Ramo, ligado: boolean) {
    setMarcados((atual) => (ligado ? [...atual, ramo] : atual.filter((r) => r !== ramo)));
  }

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (enviando.current || marcados.length === 0) return;
    enviando.current = true;
    setEstado("enviando");

    // Na ordem da lista, não na ordem do clique.
    const segmentos = (Object.keys(RAMOS) as Ramo[]).filter((r) => marcados.includes(r));
    sessao.gravarRamos(segmentos);
    trackRamoConcluido(segmentos, () => {
      if (SENHA_ATIVA) {
        irPara("senha");
        return;
      }
      if (!entrarNoApp()) {
        enviando.current = false;
        setEstado("falhou");
      }
    });
  }

  const nome = primeiroNome(lead?.name);
  // Antes de hidratar (ou sem conta, já saindo), nada de formulário.
  const pronto = conta?.criada === true;

  return (
    <FluxoBShell
      progresso={estado === "enviando" && !SENHA_ATIVA ? PROGRESSO.app : PROGRESSO.ramo}
      painel={
        <>
          <span className={e.painelIcone} aria-hidden="true">
            <UserRound size={32} strokeWidth={2} />
          </span>
          {nome && <p className={styles.nome}>{nome}</p>}
          <p>Vamos deixar o ady com a cara do seu negócio.</p>
        </>
      }
    >
      {estado === "falhou" ? (
        <FalhaAoEntrar />
      ) : (
        pronto && (
          <form onSubmit={onSubmit} noValidate className={styles.form}>
            <fieldset className={styles.fieldset} aria-describedby={`${id}-apoio`}>
              <legend className={styles.legend}>
                <h1 className={e.titulo}>Qual é o ramo do seu negócio?</h1>
              </legend>
              <p id={`${id}-apoio`} className={e.apoio}>
                Marque quantos quiser. Assim o ady cria posts e anúncios com a cara do seu negócio.
              </p>

              <div className={styles.cartoes}>
                {(Object.entries(RAMOS) as [Ramo, string][]).map(([chave, texto]) => (
                  <label key={chave} className={styles.cartao}>
                    <input
                      type="checkbox"
                      name="ramo"
                      value={chave}
                      checked={marcados.includes(chave)}
                      onChange={(ev) => alternar(chave, ev.target.checked)}
                      disabled={estado === "enviando"}
                      className={styles.caixa}
                    />
                    <span className={styles.marca} aria-hidden="true">
                      <Check size={18} strokeWidth={3} />
                    </span>
                    <span>{texto}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className={`lp-cta lp-cta--wide ${e.botao}`}
              disabled={marcados.length === 0 || estado === "enviando"}
            >
              {estado === "enviando" ? (
                <>
                  <span className={e.spinner} aria-hidden="true" />
                  Continuando…
                </>
              ) : (
                "Continuar"
              )}
            </button>
            <div role="status" aria-live="polite" className="visually-hidden">
              {estado === "enviando" ? (SENHA_ATIVA ? "Indo para a criação de senha." : "Abrindo o ady.") : ""}
            </div>
          </form>
        )
      )}
    </FluxoBShell>
  );
}
