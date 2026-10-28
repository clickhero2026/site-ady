import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A LP do teste grátis roda num host próprio (ver src/proxy.ts); em
  // desenvolvimento ele é simulado com lp.localhost:3000, que o dev
  // server bloquearia como origem cruzada sem esta linha.
  allowedDevOrigins: ["lp.localhost"],
  images: {
    // AVIF primeiro (menor), WebP pra quem não suporta.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
