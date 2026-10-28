import Image from "next/image";
import { Bookmark, CircleCheck, Heart, MessageCircle, Send } from "lucide-react";
import styles from "./HeroVisual.module.css";

/**
 * Composição do hero: celular com um post do ady publicado no Instagram
 * e uma mensagem de WhatsApp chegando. A moldura é HTML/CSS; o post é
 * print real do app (recorte da tela "Novo post", IMG-013). Não há print
 * real dessa cena inteira — ver lista de pendências da LP.
 */
export function HeroVisual() {
  return (
    <div className={styles.cena} aria-hidden="true">
      <div className={styles.brilho} />

      <div className={styles.celular}>
        <div className={styles.notch} />
        <div className={styles.tela}>
          <div className={styles.igTopo}>
            <span className={styles.avatar}>
              <span className={styles.avatarPonto} />
            </span>
            <span className={styles.igNome}>useadyapp</span>
          </div>

          <Image
            src="/teste7d/post.webp"
            alt=""
            width={346}
            height={270}
            sizes="(min-width: 64rem) 300px, 70vw"
            loading="eager"
            className={styles.post}
          />

          <div className={styles.igAcoes}>
            <Heart size={22} strokeWidth={2} />
            <MessageCircle size={22} strokeWidth={2} />
            <Send size={22} strokeWidth={2} />
            <Bookmark size={22} strokeWidth={2} className={styles.igSalvar} />
          </div>
          <p className={styles.igLegenda}>
            <strong>useadyapp</strong> Conheça o ady, sua agência de marketing de bolso.
          </p>
          <div className={styles.igFantasma} />
          <div className={styles.igFantasma} />
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
