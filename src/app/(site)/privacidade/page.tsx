import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacidade — ady",
  description: "Como a CloserX Ltda, responsável pelo ady, trata os seus dados.",
};

/**
 * Conteúdo final — não é rascunho. Copiado exatamente de
 * `paginas-legais-ady.md` (raiz do projeto), que documenta as fontes dos
 * dados (CNPJ, e-mail, Instagram) e traz o aviso de que precisa de revisão
 * de um advogado antes de publicar, especialmente quando o ady passar a
 * conectar Instagram/conta de anúncio de verdade na ativação.
 */
export default function PrivacidadePage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      updatedAt="20 de agosto de 2026"
      showCta={false}
    >
      <p>
        Esta Política de Privacidade descreve como a CloserX Ltda
        (&ldquo;Click Hero&rdquo;, &ldquo;ady&rdquo;, &ldquo;nós&rdquo;),
        inscrita no CNPJ 52.243.325/0001-07, trata os dados pessoais de quem
        visita este site (useady.com.br) ou preenche nosso formulário de
        contato, em conformidade com a Lei Geral de Proteção de Dados (Lei nº
        13.709/2018 — LGPD).
      </p>

      <section>
        <h2>1. Quem é o responsável pelos seus dados</h2>
        <p>
          CloserX Ltda, CNPJ 52.243.325/0001-07, responsável pelo produto
          ady.
          <br />
          Contato: <a href="mailto:rafael@clickhero.com.br">rafael@clickhero.com.br</a>
        </p>
      </section>

      <section>
        <h2>2. Quais dados coletamos</h2>
        <p>
          <strong>Dados que você nos fornece diretamente</strong>, ao
          preencher o formulário deste site:
        </p>
        <ul>
          <li>Nome</li>
          <li>Número de WhatsApp</li>
          <li>Nome do seu negócio</li>
          <li>Segmento do seu negócio (ex.: barbearia, clínica odontológica, academia)</li>
          <li>Plano de interesse</li>
        </ul>
        <p>
          <strong>Dados coletados automaticamente</strong>, durante a
          navegação no site:
        </p>
        <ul>
          <li>Páginas visitadas e tempo de navegação</li>
          <li>Origem do acesso (ex.: se você veio de um anúncio ou de uma busca)</li>
          <li>Interações com botões e seções da página</li>
        </ul>
        <p>
          Esses dados automáticos são coletados via Google Tag Manager e
          Meta Pixel, ferramentas de terceiros descritas na seção 5.
        </p>
        <p>
          Não coletamos dados sensíveis (saúde, origem racial, opinião
          política, etc.) neste site.
        </p>
      </section>

      <section>
        <h2>3. Para que usamos seus dados</h2>
        <ul>
          <li>
            Entrar em contato com você por WhatsApp para apresentar o ady e
            dar continuidade ao seu interesse
          </li>
          <li>
            Entender de onde vêm nossos visitantes e melhorar o site e
            nossos anúncios
          </li>
          <li>Cumprir obrigações legais, quando aplicável</li>
        </ul>
        <p>Não vendemos seus dados pessoais a terceiros.</p>
      </section>

      <section>
        <h2>4. Com quem compartilhamos seus dados</h2>
        <ul>
          <li>
            <strong>Bitrix24</strong>: o formulário de contato envia seus
            dados para nosso sistema de gestão de relacionamento (CRM),
            usado internamente para organizar e responder aos contatos
            recebidos
          </li>
          <li>
            <strong>Meta (Facebook/Instagram)</strong>: através do Meta
            Pixel, para medir a eficiência de nossos anúncios e mostrar
            anúncios relevantes a pessoas com perfil semelhante ao de quem
            visita nosso site
          </li>
          <li>
            <strong>Google</strong>: através do Google Tag Manager, para
            gerenciar as ferramentas de medição do site
          </li>
        </ul>
        <p>
          Cada um desses serviços tem sua própria política de privacidade,
          que recomendamos consultar.
        </p>
      </section>

      <section>
        <h2>5. Cookies e ferramentas de medição</h2>
        <p>
          Este site usa cookies e tecnologias semelhantes para funcionar
          corretamente e para medir o desempenho de nossas páginas e
          anúncios, através do Google Tag Manager e do Meta Pixel. Você pode
          desativar cookies nas configurações do seu navegador, mas isso
          pode afetar o funcionamento de algumas partes do site.
        </p>
      </section>

      <section>
        <h2>6. Por quanto tempo guardamos seus dados</h2>
        <p>
          Guardamos os dados do formulário de contato enquanto durar nosso
          relacionamento com você ou até que você solicite a exclusão, o que
          ocorrer primeiro. Dados de navegação coletados por cookies seguem
          o prazo padrão de cada ferramenta (Google e Meta).
        </p>
      </section>

      <section>
        <h2>7. Seus direitos</h2>
        <p>Conforme a LGPD, você pode a qualquer momento:</p>
        <ul>
          <li>Confirmar se tratamos dados seus</li>
          <li>Pedir uma cópia dos seus dados</li>
          <li>Pedir a correção de dados incompletos ou desatualizados</li>
          <li>Pedir a exclusão dos seus dados</li>
          <li>Retirar seu consentimento</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, escreva para{" "}
          <a href="mailto:rafael@clickhero.com.br">rafael@clickhero.com.br</a>.
        </p>
      </section>

      <section>
        <h2>8. Segurança</h2>
        <p>
          Adotamos medidas técnicas e organizacionais razoáveis para
          proteger seus dados contra acesso não autorizado, perda ou uso
          indevido.
        </p>
      </section>

      <section>
        <h2>9. Alterações desta política</h2>
        <p>
          Podemos atualizar esta política periodicamente. A data no topo da
          página indica a versão mais recente. Mudanças relevantes serão
          comunicadas neste site.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <p>
          CloserX Ltda — CNPJ 52.243.325/0001-07
          <br />
          E-mail: <a href="mailto:rafael@clickhero.com.br">rafael@clickhero.com.br</a>
          <br />
          Instagram:{" "}
          <a href="https://instagram.com/useadyapp" target="_blank" rel="noopener noreferrer">
            @useadyapp
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
