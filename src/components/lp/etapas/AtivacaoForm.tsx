"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TriangleAlert } from "lucide-react";
import { TESTE7D } from "@/config/teste7d";
import { trackTeste7dAtivacao } from "@/lib/analytics";
import {
  ACAO_DESEJADA,
  ACESSO_REDES,
  ARQUIVO_LOGO,
  CARTAO_PAGAMENTO,
  CONTA_ANUNCIOS,
  EXPERIENCIA_ANUNCIOS,
  REUNIAO_COMPUTADOR,
} from "@/lib/teste7dOptions";
import {
  BLOCOS,
  TELAS,
  telaDoCampo,
  telaRespondida,
  type CampoEtapa2,
  type Respostas,
  type TelaId,
} from "@/lib/teste7dEtapa2";
import { useVisivelComTeclado } from "@/lib/useVisivelComTeclado";
import { ErroCampo } from "../ErroCampo";
import { useHidratado } from "../InscricaoForm";
import { ChoiceCards } from "./ChoiceCards";
import styles from "./Etapa2.module.css";

/** Mensagem quando a pessoa tenta seguir sem responder. */
const FALTA: Record<TelaId, string> = {
  negocio: "Conte o nome do seu negócio e o que você vende.",
  cidade: "Escreva a cidade e o bairro, ou marque que atende todo o Brasil.",
  acao: "Escolha uma opção.",
  experiencia: "Escolha uma opção.",
  acesso: "Escolha uma opção.",
  conta: "Escolha uma opção.",
  cartao: "Escolha uma opção.",
  logo: "Escolha uma opção.",
  reuniao: "Escolha uma opção.",
  observacoes: "",
};

/**
 * Etapa 2 — briefing de ativação, uma pergunta por tela. Ao avançar, salva
 * via PATCH só os campos do bloco da tela atual; a última tela manda
 * `concluir: true`. Se a API devolver o que falta, leva a pessoa até a
 * pergunta e mostra o aviso lá.
 *
 * O botão trava no primeiro clique (ref + estado) — nada de dois PATCH
 * em sequência do mesmo bloco.
 */
export function AtivacaoForm({ inicial, telaInicial }: { inicial: Respostas; telaInicial: number }) {
  const [tela, setTela] = useState(telaInicial);
  const [r, setR] = useState<Respostas>(inicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const travado = useRef(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const primeiraRenderizacao = useRef(true);
  const hidratado = useHidratado();
  const formRef = useRef<HTMLFormElement>(null);
  const acoesRef = useRef<HTMLDivElement>(null);
  useVisivelComTeclado(formRef, acoesRef);

  const atual = TELAS[tela];
  const ultima = tela === TELAS.length - 1;
  const erroId = `erro-${atual.id}`;

  // Troca de tela: foco no título da pergunta (leitor de tela anuncia, e
  // o teclado continua de onde faz sentido). Na primeira carga, não.
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    tituloRef.current?.focus();
  }, [tela]);

  function set<K extends keyof Respostas>(campo: K, valor: Respostas[K]) {
    setR((prev) => ({ ...prev, [campo]: valor }));
    setErro("");
  }

  function irPara(indice: number, mensagem = "") {
    setTela(indice);
    setErro(mensagem);
  }

  async function avancar(event: FormEvent) {
    event.preventDefault();
    if (travado.current) return;

    if (!telaRespondida(atual.id, r)) {
      setErro(FALTA[atual.id]);
      return;
    }

    // Campos do bloco inteiro (todas as telas dele), só os respondidos.
    const campos = TELAS.filter((t) => t.bloco === atual.bloco).flatMap((t) => t.campos);
    const payload: Record<string, unknown> = {};
    for (const campo of campos) {
      if (r[campo] !== undefined) payload[campo] = r[campo];
    }
    if (ultima) payload.concluir = true;

    travado.current = true;
    setSalvando(true);
    try {
      const res = await fetch("/api/teste7d/ativacao", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 404) {
        window.location.assign(TESTE7D.paginas.lp);
        return;
      }

      if (!res.ok || !json.ok) {
        const pendencias = json.pendencias as { campo: CampoEtapa2; pergunta: string }[] | undefined;
        const campo: string | undefined = pendencias?.[0]?.campo ?? json.campo;
        const destino = campo ? telaDoCampo(campo) : -1;
        const mensagem = pendencias?.length
          ? "Falta responder esta pergunta para continuar."
          : (json.error ?? "Não deu para salvar agora. Tente de novo em instantes.");
        if (destino >= 0) irPara(destino, mensagem);
        else setErro(mensagem);
        travado.current = false;
        setSalvando(false);
        return;
      }

      if (ultima) {
        // Fica travado: a próxima página carrega do zero. Na primeira
        // conclusão, o activation_complete sai antes (mesmo esquema do Lead:
        // segue quando o GTM confirmar ou depois de 2,5s, se ele falhar).
        let foi = false;
        const seguir = () => {
          if (foi) return;
          foi = true;
          window.location.assign(TESTE7D.paginas.agendar);
        };
        if (json.primeira_conclusao === true && typeof json.eventId === "string") {
          trackTeste7dAtivacao(json.eventId, seguir);
          window.setTimeout(seguir, 2500);
        } else {
          seguir();
        }
        return;
      }
      irPara(tela + 1);
    } catch {
      setErro("Sem conexão no momento. Confira sua internet e tente de novo.");
    }
    travado.current = false;
    setSalvando(false);
  }

  const blocoMudou = tela === 0 || TELAS[tela - 1].bloco !== atual.bloco;

  return (
    <form ref={formRef} className={styles.form} method="post" onSubmit={avancar} noValidate>
      <div className={styles.cabecalhoBloco}>
        <p className={styles.blocoNome}>{BLOCOS[atual.bloco]}</p>
        <p className={styles.contador}>
          Pergunta {tela + 1} de {TELAS.length}
        </p>
        <div
          className={styles.barra}
          role="progressbar"
          aria-label="Perguntas respondidas"
          aria-valuemin={0}
          aria-valuemax={TELAS.length}
          aria-valuenow={tela}
        >
          <span style={{ width: `${(tela / TELAS.length) * 100}%` }} />
        </div>
      </div>

      {atual.bloco === 3 && blocoMudou && (
        <p className={styles.intro}>
          Essas três respostas são as que mais atrasam o começo. Responda com sinceridade. Se faltar alguma coisa, a
          gente te ajuda a resolver.
        </p>
      )}

      <h2 ref={tituloRef} tabIndex={-1} className="visually-hidden">
        {BLOCOS[atual.bloco]}, pergunta {tela + 1} de {TELAS.length}
      </h2>

      <div className={styles.tela} key={atual.id}>
        {atual.id === "negocio" && (
          <div className={styles.fieldset}>
            <label htmlFor="negocio" className={styles.pergunta}>
              Qual o nome do seu negócio e o que você vende?
            </label>
            <p id="negocio-nota" className={styles.nota}>
              Pode escrever do seu jeito. Exemplo: &ldquo;Pizzaria do Zé, pizza e esfiha para entrega em casa&rdquo;
            </p>
            <textarea
              id="negocio"
              className={styles.texto}
              rows={3}
              autoCapitalize="sentences"
              maxLength={300}
              value={r.negocio_nome_oferta ?? ""}
              onChange={(e) => set("negocio_nome_oferta", e.target.value)}
              aria-describedby={`negocio-nota${erro ? ` ${erroId}` : ""}`}
              aria-invalid={Boolean(erro) || undefined}
            />
            {erro && <ErroCampo id={erroId}>{erro}</ErroCampo>}
          </div>
        )}

        {atual.id === "cidade" && (
          <div className={styles.fieldset}>
            <label htmlFor="cidade" className={styles.pergunta}>
              Você atende clientes de qual cidade e bairro?
            </label>
            <input
              id="cidade"
              className={styles.texto}
              type="text"
              maxLength={200}
              placeholder="Ex.: Fortaleza, Aldeota"
              autoCapitalize="words"
              autoComplete="address-level2"
              enterKeyHint="next"
              value={r.cidade_bairro ?? ""}
              onChange={(e) => set("cidade_bairro", e.target.value)}
              aria-describedby={erro ? erroId : undefined}
              aria-invalid={Boolean(erro) || undefined}
            />
            <label className={`${styles.cartao} ${styles.cartaoCheck}`}>
              <input
                type="checkbox"
                className={styles.radio}
                checked={r.atende_todo_brasil === true}
                onChange={(e) => set("atende_todo_brasil", e.target.checked)}
              />
              <span className={`${styles.cartaoMarca} ${styles.cartaoMarcaCheck}`} aria-hidden="true" />
              <span>Atendo todo o Brasil / vendo pela internet</span>
            </label>
            {erro && <ErroCampo id={erroId}>{erro}</ErroCampo>}
          </div>
        )}

        {atual.id === "acao" && (
          <ChoiceCards
            name="acao_desejada"
            pergunta="Quando a pessoa vir o seu anúncio, o que você quer que ela faça?"
            opcoes={ACAO_DESEJADA}
            valor={r.acao_desejada}
            onChange={(v) => set("acao_desejada", v)}
            erro={erro}
            erroId={erroId}
          >
            {r.acao_desejada === "outro" && (
              <div className={styles.outro}>
                <label htmlFor="acao-outro" className={styles.outroLabel}>
                  Conte o que você quer que a pessoa faça
                </label>
                <input
                  id="acao-outro"
                  className={styles.texto}
                  type="text"
                  maxLength={200}
                  value={r.acao_desejada_outro ?? ""}
                  onChange={(e) => set("acao_desejada_outro", e.target.value)}
                />
              </div>
            )}
          </ChoiceCards>
        )}

        {atual.id === "experiencia" && (
          <ChoiceCards
            name="experiencia_anuncios"
            pergunta="Você já pagou para divulgar seu negócio no Instagram ou no Facebook?"
            opcoes={EXPERIENCIA_ANUNCIOS}
            valor={r.experiencia_anuncios}
            onChange={(v) => set("experiencia_anuncios", v)}
            erro={erro}
            erroId={erroId}
          />
        )}

        {atual.id === "acesso" && (
          <ChoiceCards
            name="acesso_redes"
            pergunta="Seu negócio tem perfil no Instagram e página no Facebook? E você tem o login e a senha em mãos?"
            nota={
              <span className={styles.aviso}>
                <TriangleAlert aria-hidden="true" size={22} strokeWidth={2.25} />
                Nunca envie senhas por aqui. A gente vê isso juntos na conversa.
              </span>
            }
            opcoes={ACESSO_REDES}
            valor={r.acesso_redes}
            onChange={(v) => set("acesso_redes", v)}
            erro={erro}
            erroId={erroId}
          />
        )}

        {atual.id === "conta" && (
          <ChoiceCards
            name="conta_anuncios"
            pergunta="Você já tem uma conta de anúncios criada? (o Facebook chama isso de Gerenciador de Negócios)"
            opcoes={CONTA_ANUNCIOS}
            valor={r.conta_anuncios}
            onChange={(v) => set("conta_anuncios", v)}
            erro={erro}
            erroId={erroId}
          />
        )}

        {atual.id === "cartao" && (
          <ChoiceCards
            name="cartao_pagamento"
            pergunta="Você tem um cartão de crédito para cadastrar como forma de pagamento dos anúncios?"
            nota="Não precisa enviar nenhum número agora. É só para a gente saber se o pagamento já está resolvido."
            opcoes={CARTAO_PAGAMENTO}
            valor={r.cartao_pagamento}
            onChange={(v) => set("cartao_pagamento", v)}
            erro={erro}
            erroId={erroId}
          />
        )}

        {atual.id === "logo" && (
          <ChoiceCards
            name="arquivo_logo"
            pergunta="Você tem o arquivo da logo do seu negócio salvo no celular ou no computador?"
            opcoes={ARQUIVO_LOGO}
            valor={r.arquivo_logo}
            onChange={(v) => set("arquivo_logo", v)}
            erro={erro}
            erroId={erroId}
          />
        )}

        {atual.id === "reuniao" && (
          <ChoiceCards
            name="reuniao_computador"
            pergunta="Você consegue participar pelo computador, com internet boa e cerca de 1 hora livre sem interrupção?"
            nota="Precisa ser pelo computador porque vamos mexer juntos nas configurações da sua conta."
            opcoes={REUNIAO_COMPUTADOR}
            valor={r.reuniao_computador}
            onChange={(v) => set("reuniao_computador", v)}
            erro={erro}
            erroId={erroId}
          />
        )}

        {atual.id === "observacoes" && (
          <div className={styles.fieldset}>
            <label htmlFor="observacoes" className={styles.pergunta}>
              Quer contar mais alguma coisa antes da conversa?
            </label>
            <p id="observacoes-nota" className={styles.nota}>
              Opcional. Alguma dúvida, alguma experiência ruim que já teve com anúncios, qualquer coisa.
            </p>
            <textarea
              id="observacoes"
              className={styles.texto}
              rows={4}
              autoCapitalize="sentences"
              maxLength={2000}
              value={r.observacoes ?? ""}
              onChange={(e) => set("observacoes", e.target.value)}
              aria-describedby={`observacoes-nota${erro ? ` ${erroId}` : ""}`}
            />
            {erro && <ErroCampo id={erroId}>{erro}</ErroCampo>}
          </div>
        )}
      </div>

      <div ref={acoesRef} className={styles.acoes}>
        {tela > 0 && (
          <button type="button" className={styles.voltar} onClick={() => irPara(tela - 1)} disabled={salvando}>
            Voltar
          </button>
        )}
        <button type="submit" className="lp-cta" disabled={!hidratado || salvando}>
          {salvando ? "SALVANDO…" : ultima ? "CONTINUAR PARA O HORÁRIO" : "CONTINUAR"}
        </button>
      </div>
    </form>
  );
}
