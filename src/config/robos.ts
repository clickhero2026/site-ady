/**
 * User-Agents de robôs de prévia de link e de busca. O link de ativação
 * (`/ativar-conta?t=`) não conta como retomada quando quem abre é um
 * deles: o WhatsApp, por exemplo, abre o link sozinho pra montar a prévia
 * assim que a mensagem é enviada.
 *
 * Cada item é um trecho procurado no User-Agent, sem diferenciar
 * maiúsculas de minúsculas. Pra incluir um robô, acrescente o trecho
 * aqui. Evite trechos genéricos como "bot": casam com nome de celular
 * (ex. "CUBOT") e bloqueariam gente de verdade.
 */
export const ROBOS_USER_AGENT: readonly string[] = [
  // Prévia de link em apps de mensagem e redes
  "WhatsApp",
  "facebookexternalhit",
  "facebot",
  "meta-externalagent",
  "Twitterbot",
  "TelegramBot",
  "Slackbot",
  "Slack-ImgProxy",
  "LinkedInBot",
  "Discordbot",
  "SkypeUriPreview",
  "Pinterestbot",
  "redditbot",
  "Embedly",
  "Iframely",
  "vkShare",
  "Viber",
  "Snapchat",
  "Mastodon",
  // Buscadores
  "Googlebot",
  "Google-InspectionTool",
  "GoogleOther",
  "AdsBot-Google",
  "bingbot",
  "BingPreview",
  "Applebot",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
  // Ferramentas de linha de comando e bibliotecas HTTP
  "curl",
  "Wget",
  "python-requests",
  "python-urllib",
  "Go-http-client",
  "okhttp",
  "axios",
  "libwww-perl",
];
