import styles from "./Faq.module.css";

const items = [
  {
    q: "Preciso entender de marketing ou de anúncio?",
    a: "Não. Se você souber dizer o que seu negócio vende e pra quem, está resolvido. O resto é com o ady.",
  },
  {
    q: "E se ele publicar alguma coisa que eu não gosto?",
    a: "Você tem acesso a tudo antes e depois. Se quiser mudar, muda. Se preferir olhar tudo antes de sair, dá pra configurar assim. Só que a maioria das pessoas deixa ele tocar sozinho depois da primeira semana.",
  },
  {
    q: "Além da mensalidade, quanto vou gastar de anúncio?",
    a: "Isso é decisão sua e o dinheiro sai da sua conta direto pra Meta. Negócios locais costumam começar com algo entre R$ 15 e R$ 30 por dia. Dá pra começar menor e aumentar quando vir resultado.",
  },
  {
    q: "A conta do Instagram e a conta de anúncio são minhas?",
    a: "Suas. O ady trabalha dentro das suas contas. Se um dia você sair, tudo continua com você.",
  },
  {
    q: "Funciona pro meu tipo de negócio?",
    a: "Ele foi feito pra negócio local que atende gente da região: supermercado, clínica, barbearia, academia, loja de carro, pet shop, restaurante. Se o seu cliente mora perto de você, funciona.",
  },
  {
    q: "Tem fidelidade?",
    a: "Não. Você cancela quando quiser, sem multa.",
  },
  {
    q: "Quanto tempo até começar a rodar?",
    a: "No mesmo dia. A gente conecta suas contas com você pelo WhatsApp e o ady já começa a montar seu conteúdo.",
  },
];

export function Faq() {
  return (
    <section id="perguntas" className="section">
      <div className="container">
        <h2 className="section-title">Perguntas</h2>

        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.question}>{item.q}</summary>
              <p className={`body-text ${styles.answer}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
