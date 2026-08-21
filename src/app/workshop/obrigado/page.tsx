import type { Metadata } from "next";
import { WORKSHOP, WORKSHOP_WHATSAPP } from "@/config/workshop";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { AdySymbol } from "@/components/workshop/AdySymbol";
import { FireLeadEvent } from "@/components/analytics/FireLeadEvent";
import styles from "./page.module.css";

// noindex: briefing, seção 5 — só esta página do workshop leva noindex.
export const metadata: Metadata = {
  title: "Vaga garantida — Workshop ady",
  description:
    "Você garantiu sua vaga no workshop ao vivo. A gente manda o link do Zoom pelo WhatsApp.",
  robots: { index: false, follow: false },
};

const JEAN_MESSAGE = "Oi Jean, acabei de me inscrever no workshop";

// Texto literal do briefing ("dura 1 hora") — se a duração de uma turma
// futura mudar de verdade, ajustar esta frase junto com
// WORKSHOP.duracaoMinutos.
const SHARE_MESSAGE =
  `Achei que isso ia te interessar. É um workshop ao vivo pra dono de ` +
  `negócio local, sobre como fazer o Instagram trazer cliente sem ter que ` +
  `contratar alguém pra cuidar disso. É dia ${WORKSHOP.data} às ${WORKSHOP.horario}, ` +
  `dura 1 hora e não fica gravado. Tem vaga limitada: useady.com.br/workshop`;

/**
 * Evento `Lead` (briefing seção 5: "no carregamento da página, não no
 * clique do botão") via `FireLeadEvent` — o mesmo componente cliente
 * minúsculo já usado no /obrigado da home, só pra isolar o `useEffect`
 * sem transformar esta página num Client Component inteira.
 *
 * `PageView` em /workshop não precisa de nada novo aqui: o
 * `AnalyticsRouteTracker` já vive no root layout e dispara em toda
 * navegação, /workshop incluído.
 *
 * Nota: o briefing fala em "Meta Pixel" — neste projeto isso foi trocado
 * por só GTM (decisão do Rafael, mesma do restante do site). Se algum dia
 * precisar do Pixel de verdade, ele entra como tag dentro do próprio GTM,
 * disparado por esses mesmos eventos de dataLayer.
 */
export default function WorkshopObrigadoPage() {
  const jeanHref = buildWhatsappLink(WORKSHOP_WHATSAPP, JEAN_MESSAGE);
  const shareHref = `https://wa.me/?text=${encodeURIComponent(SHARE_MESSAGE)}`;
  const icsHref = WORKSHOP.dataISO ? "/api/workshop-ics" : null;

  return (
    <div className={styles.page}>
      <FireLeadEvent />
      <div className={styles.inner}>
        <AdySymbol size={40} />

        <h1 className={styles.title}>Vaga garantida.</h1>
        <p className={styles.body}>
          A gente vai te mandar o link do Zoom no WhatsApp, e um lembrete
          no dia.
        </p>

        <div className={styles.commitBox}>
          <p className={styles.commitDate}>
            {WORKSHOP.data}, às {WORKSHOP.horario} · {WORKSHOP.duracaoLabel}
          </p>
          <p className={styles.commitBody}>
            Coloca na agenda agora, antes de fechar essa página. O
            workshop não fica gravado — se você não estiver ao vivo, não
            tem como assistir depois.
          </p>
        </div>

        <div className={styles.actions}>
          {icsHref ? (
            <a className={styles.primary} href={icsHref}>
              Adicionar na minha agenda
            </a>
          ) : (
            <p className={styles.pendingNote}>
              O convite de calendário chega junto com a confirmação por
              WhatsApp.
            </p>
          )}

          {jeanHref && (
            <a
              className={styles.secondary}
              href={jeanHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chamar o Jean no WhatsApp
            </a>
          )}
        </div>

        <hr className={styles.divider} />

        <h2 className={styles.subtitle}>Conhece alguém que precisa disso?</h2>
        <p className={styles.body}>
          Ainda tem vaga nessa turma. Se você conhece outro dono de
          negócio que vive o mesmo problema, manda o convite pra ele.
        </p>

        <a
          className={styles.secondary}
          href={shareHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enviar convite pelo WhatsApp
        </a>

        <p className={styles.footer}>ady · um produto Click Hero</p>
      </div>
    </div>
  );
}
