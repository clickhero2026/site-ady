"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/cta/CtaButton";
import { trackViewPlans } from "@/lib/analytics";
import styles from "./Plans.module.css";

const SOCIAL_FEATURES = [
  "Planejamento do seu mês de conteúdo",
  "Posts criados e publicados no Instagram",
  "Até 8 posts por mês",
  "Suporte no WhatsApp",
];

const ANUNCIOS_FEATURES = [
  "Tudo do plano Social",
  "Seus anúncios criados e no ar",
  "Até 30 imagens por mês",
  "Até 2 anúncios rodando ao mesmo tempo",
  "Acompanhamento do que cada cliente novo custou",
  "Suporte no WhatsApp",
];

export function Plans() {
  const sectionRef = useRef<HTMLElement>(null);

  // view_item_list: dispara uma única vez, quando a seção de planos entra
  // no viewport (não a cada scroll pra dentro/fora).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackViewPlans();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="planos" ref={sectionRef} className="section">
      <div className="container">
        <h2 className="section-title">
          Dois planos. Escolha pelo que você precisa agora.
        </h2>

        <div className={styles.cards}>
          <article className={styles.card}>
            <h3 className={styles.planName}>ady Social</h3>
            <p className={styles.price}>R$ 69 por mês</p>
            <p className={styles.forWhom}>
              Pra quem precisa estar aparecendo com constância:
            </p>

            <ul className={styles.features}>
              {SOCIAL_FEATURES.map((feature) => (
                <li key={feature}>
                  <Check aria-hidden="true" size={18} className={styles.checkIcon} />
                  {feature}
                </li>
              ))}
            </ul>

            <CtaButton plan="social" variant="outline" className={styles.cta}>
              Começar com o Social
            </CtaButton>
          </article>

          <article className={`${styles.card} ${styles.featured}`}>
            <h3 className={styles.planName}>ady Anúncios</h3>
            <p className={styles.price}>R$ 297 por mês</p>
            <p className={styles.forWhom}>
              Pra quem quer aparecer e trazer cliente novo:
            </p>

            <ul className={styles.features}>
              {ANUNCIOS_FEATURES.map((feature) => (
                <li key={feature}>
                  <Check aria-hidden="true" size={18} className={styles.checkIcon} />
                  {feature}
                </li>
              ))}
            </ul>

            <CtaButton plan="completo" className={styles.cta}>
              Quero o ady Anúncios
            </CtaButton>
          </article>
        </div>

        <p className={styles.note}>
          O valor que você investe nos anúncios é pago direto pra Meta, na
          sua própria conta, e não passa pela gente. Você decide quanto quer
          investir e pode mudar quando quiser.
        </p>
      </div>
    </section>
  );
}
