"use client";

import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/cta/CtaButton";
import { trackViewPlans } from "@/lib/analytics";
import styles from "./Plans.module.css";

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
              <li>➜ Planejamento do seu mês de conteúdo</li>
              <li>➜ Posts criados e publicados no Instagram</li>
              <li>➜ Até 8 posts por mês</li>
              <li>➜ Suporte no WhatsApp</li>
            </ul>

            <CtaButton plan="social" variant="outline" className={styles.cta}>
              Começar com o Social
            </CtaButton>
          </article>

          <article className={`${styles.card} ${styles.featured}`}>
            <h3 className={styles.planName}>ady Completo</h3>
            <p className={styles.price}>R$ 297 por mês</p>
            <p className={styles.forWhom}>
              Pra quem quer aparecer e trazer cliente novo:
            </p>

            <ul className={styles.features}>
              <li>➜ Tudo do plano Social</li>
              <li>➜ Seus anúncios criados e no ar</li>
              <li>➜ Até 30 imagens por mês</li>
              <li>➜ Até 2 anúncios rodando ao mesmo tempo</li>
              <li>➜ Acompanhamento do que cada cliente novo custou</li>
              <li>➜ Suporte no WhatsApp</li>
            </ul>

            <CtaButton plan="completo" className={styles.cta}>
              Quero o Completo
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
