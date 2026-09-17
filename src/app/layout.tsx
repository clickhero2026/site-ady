import type { Metadata } from "next";
import Script from "next/script";
import { gantari } from "@/fonts";
import { AnalyticsRouteTracker } from "@/components/analytics/AnalyticsRouteTracker";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  // Sem isso, imagens de OG relativas (ex. a de /workshop) resolvem pra
  // localhost em vez do domínio real — Next avisa no build sem essa linha.
  metadataBase: new URL("https://useady.com.br"),
  title: "ady — seu negócio aparecendo todo dia",
  description:
    "O ady cria os posts, publica no seu Instagram e coloca seus anúncios no ar. Você toca o negócio. Ele cuida de te mostrar.",
};

/**
 * Loader do GTM via Stape (server-side tagging) — carrega de
 * `conversionapi.useady.com.br`, não de `googletagmanager.com`.
 *
 * Copiado literalmente do container, sem reformatar nem minificar de
 * outro jeito: o parâmetro `3a10=...` é opaco e a URL do arquivo é
 * gerada pelo Stape, então qualquer "limpeza" aqui é risco puro sem
 * ganho. Vai por `dangerouslySetInnerHTML` justamente pra preservar os
 * bytes — reescrever como JSX mudaria o conteúdo.
 *
 * Substitui o `<GoogleTagManager>` de `@next/third-parties/google`: os
 * dois juntos carregariam o mesmo container duas vezes e duplicariam
 * todo evento. O `sendGTMEvent` (usado em `lib/analytics.ts`) continua
 * valendo — ele só faz `window.dataLayer.push`, não depende daquele
 * componente, e este snippet inicializa o mesmo `dataLayer`.
 */
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s);j.async=true;j.src="https://conversionapi.useady.com.br/7mjitmrvqmoy.js?"+i;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',
'3a10=EAtQNiI%2FQCA0Wj0nQSY5Ug9SX19HVAkaRBoeFBcWFFoaAABfFAA%3D');`;

/**
 * Fallback sem JS, logo após a abertura do `<body>`. O ID do container vem
 * de `NEXT_PUBLIC_GTM_ID` pra existir uma fonte única da verdade — o
 * loader acima não precisa dele (vai pelo parâmetro opaco `3a10=...`, que
 * o Stape gera), então sem essa linha o ID ficaria hardcoded aqui e a
 * variável, órfã.
 */
function gtmNoscript(gtmId: string): string {
  return `<iframe src="https://conversionapi.useady.com.br/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}

/**
 * Layout raiz — só o que é de verdade global (fonte, GTM, tracking de
 * rota). Header, rodapé e o modal do formulário da home ficam no layout
 * do grupo `(site)`: o `/workshop` precisa de uma casca diferente (sem
 * link de navegação pra home, sem o modal — usa formulário embutido).
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="pt-BR" className={gantari.variable}>
      <head>
        {/* Google Tag Manager */}
        {/* <script> cru, não next/script: com `beforeInteractive` o Next
            não emite uma tag no <head> pra script INLINE — ele enfileira
            em `self.__next_s` no body, e o snippet só roda quando o
            runtime do Next processa a fila. Tarde demais pro loader do
            GTM, que precisa ser a primeira coisa do <head>. A doc desta
            versão (01-app/03-api-reference/02-components/script.md) só
            promete injeção no HTML inicial pro caso com `src=`. */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) — primeiro filho do <body>. O
            `<div hidden>` que aparece antes dele no HTML servido é
            injetado pelo próprio Next (boundary de streaming), fora do
            controle do layout.

            Sem `NEXT_PUBLIC_GTM_ID` o iframe não é renderizado: melhor
            não ter fallback do que apontar pra `?id=undefined`. O loader
            do <head> não depende dessa variável e segue carregando. */}
        {gtmId && (
          <noscript dangerouslySetInnerHTML={{ __html: gtmNoscript(gtmId) }} />
        )}
        {/* End Google Tag Manager (noscript) */}

        {/* beforeInteractive: injetado no <head> e roda antes da
            hidratação (ver docs/Script component) — evita o flash do
            tema errado. Precisa ficar aqui, no layout raiz (regra do
            componente Script), não num componente importado. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>

        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
        <AnalyticsRouteTracker />
      </body>
    </html>
  );
}
