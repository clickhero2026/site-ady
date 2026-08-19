import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Uso — ady",
  description: "Condições de uso do ady, produto da Click Hero.",
};

/**
 * Rascunho jurídico com as condições já estabelecidas no briefing (preços,
 * sem fidelidade, contas do cliente, investimento em anúncio direto pra
 * Meta). NÃO é aconselhamento jurídico — precisa de revisão de um advogado
 * antes de ir ao ar. Falta confirmar: razão social/CNPJ da Click Hero e o
 * foro/comarca pra resolução de disputas.
 */
export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="19 de agosto de 2026">
      <section>
        <h2>1. Aceite</h2>
        <p>
          Ao preencher o formulário do site useady.com.br e começar a usar o
          ady, você concorda com estes termos. Se não concordar, é só não
          usar o produto.
        </p>
      </section>

      <section>
        <h2>2. O que é o ady</h2>
        <p>
          O ady é um produto da Click Hero que cria conteúdo, publica no
          Instagram do seu negócio e coloca seus anúncios no ar, dentro das
          suas próprias contas. Ele foi feito pra negócio local que atende
          gente da região.
        </p>
      </section>

      <section>
        <h2>3. Planos e valores</h2>
        <p>Hoje o ady tem dois planos:</p>
        <ul>
          <li>
            <strong>ady Social</strong> — R$ 69 por mês: planejamento de
            conteúdo, posts criados e publicados no Instagram (até 8 por
            mês) e suporte no WhatsApp.
          </li>
          <li>
            <strong>ady Completo</strong> — R$ 297 por mês: tudo do Social,
            mais seus anúncios criados e no ar, até 30 imagens por mês, até
            2 anúncios rodando ao mesmo tempo e acompanhamento do que cada
            cliente novo custou.
          </li>
        </ul>
        <p>
          Não tem fidelidade nem multa: você cancela quando quiser. Podemos
          ajustar os valores dos planos no futuro — se isso acontecer,
          avisamos com antecedência.
        </p>
      </section>

      <section>
        <h2>4. Investimento em anúncios</h2>
        <p>
          O valor que você investe nos anúncios é pago direto pra Meta, na
          sua própria conta, e não passa pela Click Hero. Você decide quanto
          quer investir e pode mudar quando quiser — esse valor é separado
          da mensalidade do ady.
        </p>
      </section>

      <section>
        <h2>5. Suas contas</h2>
        <p>
          A conta do seu Instagram e a conta de anúncio usadas pelo ady são
          suas. O ady trabalha dentro delas — se você decidir sair, tudo
          continua com você. Você é responsável por manter suas contas
          ativas e com acesso liberado pro ady funcionar.
        </p>
      </section>

      <section>
        <h2>6. Suas responsabilidades</h2>
        <ul>
          <li>Fornecer informações verdadeiras sobre você e seu negócio;</li>
          <li>Manter seu WhatsApp e suas contas acessíveis pra gente conseguir te atender;</li>
          <li>Revisar o conteúdo publicado, caso configure aprovação manual;</li>
          <li>Usar o ady de forma lícita, sem infringir direitos de terceiros.</li>
        </ul>
      </section>

      <section>
        <h2>7. Cancelamento</h2>
        <p>
          Você pode cancelar quando quiser, sem multa. O cancelamento vale a
          partir do fim do período já pago — não fazemos reembolso
          proporcional de período em andamento.
        </p>
      </section>

      <section>
        <h2>8. Limitação de responsabilidade</h2>
        <p>
          O ady trabalha pra melhorar a presença e os resultados do seu
          negócio, mas não garante resultado específico de vendas ou de
          clientes novos — isso depende de vários fatores fora do nosso
          controle, como seu mercado, sua concorrência e o valor investido
          em anúncio. Também não respondemos por instabilidades do
          Instagram, da Meta ou do WhatsApp que fujam do nosso controle.
        </p>
      </section>

      <section>
        <h2>9. Propriedade intelectual</h2>
        <p>
          A marca ady, o site e a tecnologia por trás dele pertencem à Click
          Hero. O conteúdo criado especificamente pro seu negócio (posts,
          imagens, anúncios) é seu pra usar como quiser.
        </p>
      </section>

      <section>
        <h2>10. Alterações nestes termos</h2>
        <p>
          Podemos atualizar estes termos de vez em quando. Se mudarmos
          alguma coisa relevante, avisamos por aqui, com a data de
          atualização no topo da página.
        </p>
      </section>

      <section>
        <h2>11. Contato</h2>
        <p>
          Dúvidas sobre estes termos? Chama a gente em{" "}
          <a href="mailto:contato@useady.com.br">contato@useady.com.br</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
