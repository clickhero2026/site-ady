import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Uso — ady",
  description: "Termos de uso do site useady.com.br, da CloserX Ltda.",
};

/**
 * Conteúdo final — não é rascunho. Copiado exatamente de
 * `paginas-legais-ady.md` (raiz do projeto).
 */
export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="20 de agosto de 2026" showCta={false}>
      <p>
        Estes Termos de Uso regulam o acesso e uso do site useady.com.br, de
        propriedade da CloserX Ltda (&ldquo;Click Hero&rdquo;,
        &ldquo;ady&rdquo;, &ldquo;nós&rdquo;), CNPJ 52.243.325/0001-07. Ao
        usar este site, você concorda com os termos abaixo.
      </p>

      <section>
        <h2>1. Sobre o ady</h2>
        <p>
          O ady é um produto da Click Hero que ajuda donos de negócio local a
          criar conteúdo, publicar no Instagram e gerenciar anúncios com o
          apoio de inteligência artificial. Este site tem como finalidade
          apresentar o ady e permitir que interessados entrem em contato com
          nossa equipe.
        </p>
      </section>

      <section>
        <h2>2. Como funciona o contato</h2>
        <p>
          Ao preencher o formulário deste site, você concorda em ser
          contatado por nossa equipe via WhatsApp para apresentação do
          produto e continuidade do atendimento. O envio do formulário não
          representa contratação automática de nenhum plano — a contratação
          é formalizada diretamente com nossa equipe.
        </p>
      </section>

      <section>
        <h2>3. Uso do site</h2>
        <p>
          Você concorda em não utilizar este site para fins ilegais, não
          tentar acessar áreas restritas sem autorização, e não utilizar
          informações do site para fins diferentes de conhecer o produto
          ady.
        </p>
      </section>

      <section>
        <h2>4. Planos e preços</h2>
        <p>
          Os planos e valores exibidos neste site (ady Social e ady
          Anúncios) são válidos na data de publicação e podem ser alterados
          sem aviso prévio. O valor investido em anúncios, quando aplicável
          ao plano contratado, é pago diretamente à Meta na conta de
          anúncios do cliente e não está incluído na mensalidade do ady.
        </p>
      </section>

      <section>
        <h2>5. Propriedade intelectual</h2>
        <p>
          Todo o conteúdo deste site — textos, imagens, marca, logotipo e
          identidade visual do ady — é de propriedade da CloserX Ltda e não
          pode ser copiado, reproduzido ou utilizado sem autorização prévia.
        </p>
      </section>

      <section>
        <h2>6. Limitação de responsabilidade</h2>
        <p>
          Fazemos o possível para manter este site correto e disponível,
          mas não garantimos que ele estará livre de erros ou interrupções a
          todo momento. As informações aqui apresentadas têm caráter
          informativo sobre o produto ady.
        </p>
      </section>

      <section>
        <h2>7. Alterações destes termos</h2>
        <p>
          Podemos atualizar estes termos periodicamente. A data no topo da
          página indica a versão mais recente.
        </p>
      </section>

      <section>
        <h2>8. Legislação aplicável</h2>
        <p>
          Estes termos são regidos pelas leis brasileiras. Eventuais
          disputas serão resolvidas no foro da comarca de domicílio da
          CloserX Ltda.
        </p>
      </section>

      <section>
        <h2>9. Contato</h2>
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
