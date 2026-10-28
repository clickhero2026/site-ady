import Image from "next/image";
import {
  BatteryFull,
  Bookmark,
  CircleCheck,
  Clapperboard,
  Ellipsis,
  Heart,
  House,
  MessageCircle,
  Search,
  Send,
  Signal,
  SquarePlus,
  Wifi,
} from "lucide-react";
import styles from "./HeroVisual.module.css";

/**
 * Composição do hero: celular (proporção real, `--phone-ratio`) com o
 * feed do Instagram mostrando um post do ady publicado, e uma mensagem de
 * WhatsApp chegando. Tudo HTML/CSS; o post é print real do app (recorte
 * da tela "Novo post", IMG-013). Não há print real dessa cena inteira —
 * ver lista de pendências da LP. Decorativo: fora da árvore de acessibilidade.
 */
export function HeroVisual() {
  return (
    <div className={styles.cena} aria-hidden="true">
      <div className={styles.brilho} />

      <div className={styles.celular}>
        <div className={styles.ilha} />
        <div className={styles.tela}>
          <div className={styles.status}>
            <span>9:41</span>
            <span className={styles.statusIcones}>
              <Signal strokeWidth={2.5} />
              <Wifi strokeWidth={2.5} />
              <BatteryFull strokeWidth={2} />
            </span>
          </div>

          <div className={styles.igTopo}>
            <span className={styles.avatar}>
              <span className={styles.avatarPonto} />
            </span>
            <span className={styles.igNome}>useadyapp</span>
            <Ellipsis className={styles.igMais} strokeWidth={2} />
          </div>

          <Image
            src="/teste7d/post.webp"
            alt=""
            width={346}
            height={270}
            sizes="(min-width: 64rem) 260px, 220px"
            loading="eager"
            className={styles.post}
          />

          <div className={styles.igAcoes}>
            <Heart strokeWidth={2} />
            <MessageCircle strokeWidth={2} />
            <Send strokeWidth={2} />
            <Bookmark strokeWidth={2} className={styles.igSalvar} />
          </div>
          <p className={styles.igCurtidas}>128 curtidas</p>
          <p className={styles.igLegenda}>
            <strong>useadyapp</strong> Conheça o ady, sua agência de marketing de bolso.
          </p>
          <p className={styles.igQuando}>Agora mesmo</p>

          <div className={styles.igProximo}>
            <span className={styles.igProximoAvatar} />
            <span className={styles.igFantasma} />
          </div>
          <div className={styles.igProximaImagem} />

          <div className={styles.igNav}>
            <House strokeWidth={2.25} />
            <Search strokeWidth={2} />
            <SquarePlus strokeWidth={2} />
            <Clapperboard strokeWidth={2} />
            <span className={styles.igNavPerfil} />
          </div>
        </div>
      </div>

      <div className={styles.publicado}>
        <CircleCheck size={22} strokeWidth={2.25} />
        Post publicado
      </div>

      <div className={styles.whats}>
        <div className={styles.whatsTopo}>
          <span className={styles.whatsIcone}>
            <MessageCircle size={16} strokeWidth={2.5} />
          </span>
          WhatsApp · agora
        </div>
        <p className={styles.whatsBalao}>Oi, vi o post de vocês, quanto custa?</p>
      </div>
    </div>
  );
}
