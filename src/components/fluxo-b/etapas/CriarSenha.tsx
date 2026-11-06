"use client";

import { Check, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { PROGRESSO } from "@/config/fluxoB";
import { trackSenhaCriada } from "@/lib/fluxo-b/analytics";
import { entrarNoApp } from "@/lib/fluxo-b/entrarNoApp";
import { setPassword } from "@/lib/fluxo-b/password";
import { irPara } from "@/lib/fluxo-b/rotas";
import { REGRAS_SENHA, senhaValida } from "@/lib/fluxo-b/senhaRegras";
import { useSessaoFluxoB } from "@/lib/fluxo-b/useSessao";
import { FalhaAoEntrar } from "./FalhaAoEntrar";
import { FluxoBShell } from "./FluxoBShell";
import e from "./etapas.module.css";
import styles from "./CriarSenha.module.css";

const FORCA = ["Fraca", "Fraca", "Média", "Boa", "Forte"] as const;

/**
 * Tela 5 do Fluxo B — senha. Só existe com NEXT_PUBLIC_FLUXO_B_SENHA=1
 * (a página servidora redireciona quando está desligada).
 *
 * A senha vive só no estado deste componente: nunca em log, storage ou
 * dataLayer, e é apagada do estado logo depois do envio.
 */
export function CriarSenha() {
  const { lead, conta } = useSessaoFluxoB();
  const id = useId();
  const [senha, setSenha] = useState("");
  const [visivel, setVisivel] = useState(false);
  const [estado, setEstado] = useState<"livre" | "enviando" | "falhou-envio" | "falhou-entrar">("livre");
  const [tentou, setTentou] = useState(false);
  const enviando = useRef(false);

  useEffect(() => {
    if (conta === undefined) return;
    if (!conta?.criada) irPara("lp", { hash: "#cadastro", replace: true });
  }, [conta]);

  const cumpridas = REGRAS_SENHA.filter((r) => r.ok(senha)).length;
  const valida = senhaValida(senha);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setTentou(true);
    if (enviando.current || !valida || !lead) return;
    enviando.current = true;
    setEstado("enviando");

    const password = senha;
    try {
      await setPassword({ password, email: lead.email });
      setSenha("");
      trackSenhaCriada(() => {
        if (!entrarNoApp()) setEstado("falhou-entrar");
      });
    } catch {
      setSenha("");
      enviando.current = false;
      setEstado("falhou-envio");
    }
  }

  const pronto = conta?.criada === true && lead;
  const erroRegras = tentou && !valida && estado !== "enviando";

  return (
    <FluxoBShell
      progresso={estado === "enviando" ? PROGRESSO.app : PROGRESSO.senha}
      painel={
        <>
          <span className={e.painelIcone} aria-hidden="true">
            <LockKeyhole size={32} strokeWidth={2} />
          </span>
          <p className="destaque">Sua conta só abre com a sua senha.</p>
        </>
      }
    >
      {estado === "falhou-entrar" ? (
        <FalhaAoEntrar />
      ) : (
        pronto && (
          <form onSubmit={onSubmit} noValidate className={styles.form}>
            <div className={styles.cabeca}>
              <h1 className={e.titulo}>Crie sua senha</h1>
              <p className={e.apoio}>Assim só você acessa a sua conta.</p>
            </div>

            {/* Pra o gerenciador de senhas salvar com o e-mail certo. */}
            <input type="email" name="username" autoComplete="username" value={lead.email} readOnly hidden />

            <div className={styles.campo}>
              <label htmlFor={`${id}-senha`}>Senha</label>
              <div className={styles.linhaSenha}>
                <input
                  id={`${id}-senha`}
                  name="new-password"
                  type={visivel ? "text" : "password"}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={senha}
                  onChange={(ev) => setSenha(ev.target.value)}
                  aria-describedby={`${id}-regras ${id}-forca`}
                  aria-invalid={erroRegras || undefined}
                  disabled={estado === "enviando"}
                  required
                />
                <button
                  type="button"
                  className={styles.olho}
                  onClick={() => setVisivel((v) => !v)}
                  aria-pressed={visivel}
                  aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
                  aria-controls={`${id}-senha`}
                >
                  {visivel ? <EyeOff size={22} aria-hidden="true" /> : <Eye size={22} aria-hidden="true" />}
                </button>
              </div>

              <div id={`${id}-forca`} className={styles.forca}>
                <span className={styles.segmentos} data-nivel={cumpridas} aria-hidden="true">
                  {REGRAS_SENHA.map((r, i) => (
                    <span key={r.id} data-ligado={i < cumpridas || undefined} />
                  ))}
                </span>
                {senha && <span className={styles.forcaTexto}>Força: {FORCA[cumpridas]}</span>}
              </div>
            </div>

            <ul id={`${id}-regras`} className={styles.regras} aria-label="A senha precisa ter">
              {REGRAS_SENHA.map((r) => {
                const ok = r.ok(senha);
                return (
                  <li key={r.id} data-ok={ok || undefined}>
                    <span className={styles.check} aria-hidden="true">
                      <Check size={14} strokeWidth={3.5} />
                    </span>
                    {r.texto}
                    <span className="visually-hidden">{ok ? " (feito)" : " (falta)"}</span>
                  </li>
                );
              })}
            </ul>

            <button type="submit" className={`lp-cta lp-cta--wide ${e.botao}`} disabled={estado === "enviando"}>
              {estado === "enviando" ? (
                <>
                  <span className={e.spinner} aria-hidden="true" />
                  Entrando…
                </>
              ) : (
                "Entrar no ady"
              )}
            </button>

            <div role="status" aria-live="polite" className={e.status}>
              {erroRegras && <p className={styles.aviso}>A senha ainda não cumpre todas as regras acima.</p>}
              {estado === "falhou-envio" && (
                <p className={styles.aviso}>Não conseguimos salvar sua senha agora. Tente de novo em instantes.</p>
              )}
            </div>
          </form>
        )
      )}
    </FluxoBShell>
  );
}
