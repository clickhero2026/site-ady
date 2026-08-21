import { ImageResponse } from "next/og";
import { WORKSHOP } from "@/config/workshop";

/**
 * OG-W01 ainda não existe (briefing, seção 4 — 1200×630 png, "símbolo +
 * nome do workshop + data"). Enquanto isso, gera uma imagem real (não
 * quebrada) na mesma identidade visual, pra link de WhatsApp/redes já
 * mostrar prévia decente. Trocar por um arquivo estático
 * `opengraph-image.png` nesta mesma pasta quando o design chegar — o
 * Next.js prioriza o arquivo estático automaticamente sobre este gerador.
 */
export const alt = "O Instagram que vende sozinho — workshop ao vivo, ady";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          background: "#0C0D0A",
          color: "#ECEDEF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#1E88A8",
            }}
          />
          <div
            style={{
              display: "flex",
              marginLeft: 16,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 3,
              color: "#1E88A8",
            }}
          >
            WORKSHOP AO VIVO · {WORKSHOP.vagas} VAGAS
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          {WORKSHOP.nome}
        </div>

        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#8A8B85" }}>
          ady · workshop ao vivo pra dono de negocio local
        </div>
      </div>
    ),
    { ...size },
  );
}
