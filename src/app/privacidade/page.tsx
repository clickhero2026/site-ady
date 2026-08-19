import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacidade — ady",
  description: "Como o ady, produto da Click Hero, trata os seus dados.",
};

/**
 * Rascunho jurídico informado pela LGPD, escrito com os processadores de
 * dados que este projeto realmente usa (Bitrix24, Google Tag Manager,
 * WhatsApp). NÃO é aconselhamento jurídico — precisa de revisão de um
 * advogado antes de ir ao ar. Faltam: razão social/CNPJ/endereço completos
 * da Click Hero (mesmo pendente do rodapé) e confirmação do e-mail de
 * contato pra pedidos de titular de dados — usei `contato@useady.com.br`
 * como placeholder plausível.
 */
export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="19 de agosto de 2026">
      <section>
        <h2>1. Quem trata os seus dados</h2>
        <p>
          O ady é um produto da Click Hero, responsável pelo tratamento dos
          dados pessoais coletados através do site useady.com.br e dos
          canais de atendimento ligados a ele (como o WhatsApp).
        </p>
        <p>
          Dúvidas sobre esta política ou pedidos relacionados aos seus dados
          podem ser enviados para{" "}
          <a href="mailto:contato@useady.com.br">contato@useady.com.br</a>.
        </p>
      </section>

      <section>
        <h2>2. Quais dados coletamos</h2>
        <p>Quando você preenche o formulário do site, coletamos:</p>
        <ul>
          <li>Nome</li>
          <li>Número de WhatsApp</li>
          <li>Nome do seu negócio</li>
          <li>Segmento do seu negócio</li>
          <li>Plano de interesse</li>
        </ul>
        <p>
          Também coletamos, automaticamente, dados de navegação — como
          páginas visitadas e origem do acesso — através de ferramentas
          conectadas ao Google Tag Manager, que usamos pra entender como o
          site é usado e medir o resultado dos nossos anúncios.
        </p>
      </section>

      <section>
        <h2>3. Para que usamos esses dados</h2>
        <ul>
          <li>Entrar em contato com você pelo WhatsApp pra conectar o ady ao seu negócio;</li>
          <li>Organizar seus dados de contato num sistema de gestão de relacionamento (CRM);</li>
          <li>Entender como as pessoas usam o site e melhorar o que mostramos nele;</li>
          <li>Medir o resultado dos nossos próprios anúncios, pra saber se estão trazendo gente de verdade.</li>
        </ul>
      </section>

      <section>
        <h2>4. Com quem compartilhamos</h2>
        <p>Seus dados podem ser compartilhados com:</p>
        <ul>
          <li>
            <strong>Bitrix24</strong> — sistema de CRM onde armazenamos os
            dados de contato de quem preenche o formulário do site;
          </li>
          <li>
            <strong>Google Tag Manager</strong> e ferramentas conectadas a
            ele — usados pra medir navegação e anúncios do site;
          </li>
          <li>
            <strong>Vercel</strong> — provedor que hospeda o site.
          </li>
        </ul>
        <p>
          Não vendemos seus dados pra ninguém. Alguns desses fornecedores
          processam dados em servidores fora do Brasil — nesses casos, só
          trabalhamos com empresas que seguem padrões internacionais de
          proteção de dados equivalentes aos exigidos pela LGPD.
        </p>
      </section>

      <section>
        <h2>5. Cookies e tecnologias de rastreamento</h2>
        <p>
          O site usa cookies e tecnologias parecidas, carregadas através do
          Google Tag Manager, pra entender como as páginas são usadas e
          medir a origem de quem chega até nós. Você pode bloquear cookies
          nas configurações do seu navegador — algumas partes do site podem
          funcionar de forma limitada nesse caso.
        </p>
      </section>

      <section>
        <h2>6. Por quanto tempo guardamos seus dados</h2>
        <p>
          Guardamos seus dados de contato enquanto durar o relacionamento
          com a gente e pelo tempo necessário pra cumprir obrigações legais
          ou resolver eventuais disputas. Depois disso, eliminamos ou
          anonimizamos os dados.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos</h2>
        <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você pode pedir, a qualquer momento:</p>
        <ul>
          <li>Confirmação de que tratamos seus dados;</li>
          <li>Acesso aos dados que temos sobre você;</li>
          <li>Correção de dados incompletos, desatualizados ou errados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade dos seus dados pra outro fornecedor;</li>
          <li>Eliminação dos dados tratados com o seu consentimento;</li>
          <li>Informação sobre com quem compartilhamos seus dados;</li>
          <li>Revogação do seu consentimento, a qualquer momento.</li>
        </ul>
        <p>
          Pra exercer qualquer um desses direitos, é só chamar a gente em{" "}
          <a href="mailto:contato@useady.com.br">contato@useady.com.br</a>.
        </p>
      </section>

      <section>
        <h2>8. Segurança</h2>
        <p>
          Usamos medidas técnicas e administrativas razoáveis pra proteger
          seus dados contra acesso não autorizado, perda ou uso indevido.
          Nenhum sistema é 100% livre de risco, mas levamos isso a sério.
        </p>
      </section>

      <section>
        <h2>9. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta política de vez em quando. Se mudarmos
          alguma coisa relevante, avisamos por aqui, com a data de
          atualização no topo da página.
        </p>
      </section>
    </LegalLayout>
  );
}
