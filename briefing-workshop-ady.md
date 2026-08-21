# Briefing — Página de inscrição do workshop + página de obrigado

**Produto:** ady
**Contexto:** captação de inscritos para o workshop ao vivo, alimentado pela rede BNI do Jean
**Para:** desenvolvimento (Kaio)
**Domínio:** useady.com.br
**Stack:** mesmo repositório do site do ady — Next.js (App Router) + Vercel

---

## 0. O que esta página é e o que ela não é

Esta **não é** uma página de produto. É o convite de um workshop.

O motivo é estratégico e precisa ser respeitado na execução: quem convida não é o ady, é o membro do BNI convidando um contato dele. Se a página parecer "apresentação de software", o membro queima capital de relacionamento ao mandar o link. Se parecer workshop de conteúdo, ele parece bem e o contato agradece.

Consequências diretas na página:

- O ady aparece, mas **não é o assunto**. Aparece como "a ferramenta que vamos usar na demonstração", não como oferta.
- **Não tem tabela de preços.** Nem R$ 69, nem R$ 297. Nada de valor na página.
- **Não tem "teste grátis", "criar conta", "começar agora".** O único CTA do documento é: **garantir a vaga no workshop**.
- A palavra "webinar" **não aparece em lugar nenhum do texto visível**. Soa a lançamento de infoproduto. É "workshop" e "aula ao vivo".

### Decisão de rota pendente

O plano original do site previa a rota `/webinar`. Recomendo mudar para **`/workshop`**, pelo mesmo motivo acima — a URL é a primeira coisa que o convidado lê no WhatsApp.

Rota final proposta: `useady.com.br/workshop` e `useady.com.br/workshop/obrigado`
Se `/webinar` já estiver construída, manter e criar redirect 301 de `/webinar` → `/workshop`.

---

## 1. Dados do evento

| Item | Valor |
|---|---|
| Nome | O Instagram que vende sozinho |
| Subtítulo | Workshop ao vivo para donos de negócio local |
| Data | **PENDENTE — Rafael** |
| Horário | 20h (Brasília) |
| Duração | 60 minutos |
| Plataforma | Zoom, câmera aberta |
| Vagas | 30 |
| Replay | Não existe |
| Apresentação | Jean (condução) · Rafael (fundador, demonstração) |

Os quatro elementos que precisam estar visíveis acima da dobra: **data, horário, duração e o fato de não ter replay.**

---

## 2. Estrutura da página `/workshop`

Sete seções. Página curta — ela existe para converter em inscrição, não para educar. A educação acontece no workshop.

---

### Seção 1 — Hero

`[IMG-W01]` — fundo escuro #0C0D0A, sem foto de pessoa. Pode ser o símbolo do ady com respiro grande ou textura sutil. Nada de stock de "empresário sorrindo".

**Etiqueta acima do título** (petróleo #1E88A8, caixa alta, letter-spacing amplo)
WORKSHOP AO VIVO · 30 VAGAS

**Título**
O Instagram que vende sozinho

**Subtítulo**
Uma hora ao vivo mostrando como um negócio local pode aparecer todo dia no Instagram e trazer cliente novo — sem contratar ninguém e sem precisar aprender nada técnico.

**Bloco de dados do evento** (quatro itens em linha no desktop, empilhados no mobile)
➜ [DATA] às 20h
➜ 60 minutos
➜ Ao vivo, pelo Zoom
➜ Sem gravação

**Botão principal**
Garantir minha vaga

**Linha abaixo do botão** (texto menor, #8A8B85)
São 30 vagas por turma e não fica gravado. Quem não está ao vivo, perde.

---

### Seção 2 — Para quem é

**Título**
Esse workshop é pra você se:

Quatro linhas, cada uma com marcador em petróleo:

➜ Você tem um negócio que atende gente da sua cidade — loja, clínica, salão, academia, revenda
➜ Seu Instagram fica semanas parado porque você não tem tempo de pensar no que postar
➜ Você já pagou alguém pra cuidar disso e não entendeu direito o que recebeu em troca
➜ Você já tentou fazer sozinho e não conseguiu manter

**Fecho da seção**
Se você é agência, social media ou gestor de marketing, esse workshop não vai te servir. Ele foi feito pra quem tem o negócio.

*(Nota: essa última linha é deliberada. Filtra a sala e reforça pro convidado do BNI que ele é o público certo.)*

---

### Seção 3 — O que você vai ver

**Título**
O que a gente vai fazer nesses 60 minutos

Quatro blocos numerados. Sem ícone genérico — número grande em petróleo.

**01 · Por que o Instagram do seu negócio não traz cliente**
As três coisas que quase todo negócio local faz errado, e por que nenhuma delas tem a ver com você não ser bom em marketing.

**02 · A conta real de ter alguém cuidando disso**
O que uma pessoa contratada de fato faz por mês, quanto isso custa e por que essa conta raramente fecha pra um negócio local.

**03 · Uma demonstração do zero, na tela**
O Rafael vai montar ao vivo o mês inteiro de conteúdo de uma barbearia: conectar a conta, criar os posts, colocar um anúncio no ar e mostrar o resultado. Do começo ao fim, sem corte.

**04 · Suas perguntas**
Os últimos minutos são seus. Pergunte o que quiser, inclusive o que a gente ainda não resolveu.

---

### Seção 4 — Quem apresenta

Dois cards lado a lado no desktop, empilhados no mobile.

**Card 1** — `[IMG-W02]` foto do Jean
**Jean [SOBRENOME — PENDENTE]**
Sócio da Click Hero, responsável comercial

Passa o dia conversando com dono de negócio. Conduz o workshop e vai fazer, na hora da demonstração, as perguntas que você faria.

**Card 2** — `[IMG-W03]` foto do Rafael
**Rafael Cruz**
Fundador da Click Hero

Operou marketing pra dezenas de negócios locais durante anos, viu por dentro por que o modelo não funciona pro pequeno, e construiu o ady pra resolver isso. É ele quem vai mostrar a tela.

---

### Seção 5 — Honestidade sobre o estágio

Seção obrigatória. Não remover, não suavizar.

Ela existe porque a gente não tem case, não tem número de cliente e não tem prova social. A alternativa a dizer isso é o silêncio, e o silêncio nessa posição vira desconfiança. Dito na frente, vira credibilidade — e justifica a condição especial que o Jean vai oferecer no fim.

Visual: caixa com borda fina #2E2F2A, fundo levemente mais claro que o resto (#1A1B18), sem ícone de alerta.

**Título**
Uma coisa que a gente prefere dizer antes

**Corpo**
O ady é novo. Está funcionando, mas ainda não tem centenas de clientes nem depoimento em vídeo pra te mostrar.

Essas primeiras turmas são as primeiras pessoas a usar. É exatamente por isso que quem entra agora entra em condição diferente de quem vai entrar daqui a seis meses — e é por isso que a gente prefere fazer isso ao vivo, respondendo pergunta, em vez de mandar um vídeo pronto.

---

### Seção 6 — Formulário de inscrição

Âncora `#inscricao`. Todos os botões da página apontam pra cá.

**Título**
Garanta sua vaga

**Subtítulo**
[DATA], 20h. São 30 vagas e não tem gravação.

**Campos** (todos obrigatórios, salvo indicação)

| Campo | Tipo | Observação |
|---|---|---|
| Nome completo | texto | |
| WhatsApp | telefone | máscara BR, validação de 11 dígitos — é por aqui que o lembrete e o link do Zoom são enviados |
| E-mail | e-mail | |
| Nome do seu negócio | texto | |
| O que seu negócio faz | select | Alimentação/restaurante · Beleza e estética · Saúde e clínicas · Academia e esporte · Comércio e varejo · Automotivo · Serviços · Outro |
| Quem te convidou | texto | **opcional** — label: "Se alguém te indicou, coloque o nome aqui" |

O campo "quem te convidou" é o que mede a performance de cada membro do BNI. Não é enfeite: sem ele a gente não sabe qual convite funciona.

**Botão**
Quero minha vaga

**Microcopy abaixo do botão**
A gente só usa seu WhatsApp pra mandar o link e o lembrete do workshop.

**Comportamento técnico**
- Envio para o Bitrix24, mesmo padrão do formulário da home, com origem marcada como `workshop-[DATA]`
- Sem recarregar a página; estado de carregamento no botão
- Em caso de erro, mensagem clara e link de WhatsApp direto do Jean como saída alternativa
- Sucesso → redirect para `/workshop/obrigado`

---

### Seção 7 — Rodapé

Padrão do site. Logo do ady, "um produto Click Hero", links legais. Sem menu de navegação para a home — a página é de entrada única e não deve vazar o tráfego para o site de produto antes da inscrição.

---

## 3. Página `/workshop/obrigado`

Essa página não é uma tela de "recebemos seus dados". Ela tem três trabalhos, nessa ordem de prioridade: **garantir o comparecimento**, **recrutar mais um inscrito**, e **preparar o terreno da oferta**.

Sem navegação, sem rodapé completo, tela única centralizada, fundo escuro.

**Símbolo do ady no topo** — faísca solta (tamanho ≥32px)

**Título**
Vaga garantida.

**Corpo**
A gente vai te mandar o link do Zoom no WhatsApp, e um lembrete no dia.

**Bloco de compromisso** (caixa destacada, borda petróleo)

**[DATA], às 20h · 60 minutos**

Coloca na agenda agora, antes de fechar essa página. O workshop não fica gravado — se você não estiver ao vivo, não tem como assistir depois.

**Botão 1 — primário**
Adicionar na minha agenda
*(gera arquivo .ics com título, data, hora, duração de 1h e o link do Zoom na descrição — Kaio, gerar estático, não precisa de integração com Google Calendar)*

**Botão 2 — secundário**
Chamar o Jean no WhatsApp
*(link direto `wa.me` com mensagem pré-preenchida: "Oi Jean, acabei de me inscrever no workshop")*

---

**Divisória**

**Título secundário**
Conhece alguém que precisa disso?

**Corpo**
Ainda tem vaga nessa turma. Se você conhece outro dono de negócio que vive o mesmo problema, manda o convite pra ele.

**Botão de compartilhar**
Enviar convite pelo WhatsApp

Mensagem pré-preenchida no `wa.me`, texto puro:

Achei que isso ia te interessar. É um workshop ao vivo pra dono de negócio local, sobre como fazer o Instagram trazer cliente sem ter que contratar alguém pra cuidar disso. É dia [DATA] às 20h, dura 1 hora e não fica gravado. Tem vaga limitada: useady.com.br/workshop

---

**Rodapé mínimo**
Logo ady · um produto Click Hero

---

## 4. Especificação visual

Segue o Guia de Marca do ady, versão 1.0. Pontos que costumam ser violados e precisam de atenção:

| Elemento | Regra |
|---|---|
| Fundo | #0C0D0A |
| Texto | #ECEDEF · secundário #8A8B85 |
| Acento principal | Petróleo **#1E88A8** — botões, etiquetas, marcadores, bordas de destaque, foco de campo |
| Laranja #CF6F03 | **Só a faísca do símbolo.** Nenhum botão, nenhum link, nenhum título, nenhuma borda |
| Tipografia | Gantari — títulos em 600, corpo em 400, etiquetas em 500 |
| Wordmark | "ady" sempre minúsculo |
| Faísca | Solta acima de 32px, integrada abaixo |

**Assets necessários**

| ID | Descrição | Formato |
|---|---|---|
| IMG-W01 | Fundo do hero — abstrato, escuro, sem pessoas | 2400×1200 webp |
| IMG-W02 | Foto do Jean — enquadramento peito acima, fundo neutro escuro | 800×800 webp |
| IMG-W03 | Foto do Rafael — mesmo tratamento do IMG-W02 | 800×800 webp |
| OG-W01 | Imagem de compartilhamento — símbolo + nome do workshop + data | 1200×630 png |

As duas fotos precisam ter o mesmo tratamento de cor e o mesmo enquadramento. Foto de celular desalinhada em uma e retrato profissional na outra derruba a percepção da página inteira.

---

## 5. Especificação técnica

**Meta Pixel** — já instalado no site. Nesta página:
- `PageView` no carregamento de `/workshop`
- Evento `Lead` no carregamento de `/workshop/obrigado` (não no clique do botão — só conta quem realmente enviou)

Esses dois eventos são o que permite o remarketing depois: quem viu a página e não se inscreveu recebe anúncio da próxima turma.

**Metadados**
- Title: `Workshop ao vivo: o Instagram que vende sozinho · ady`
- Description: `Uma hora ao vivo mostrando como um negócio local pode aparecer todo dia no Instagram e trazer cliente novo, sem contratar ninguém. 30 vagas, sem gravação.`
- OG image: OG-W01
- `/workshop/obrigado` com `noindex`

**Performance e comportamento**
- Mobile-first. O convite chega por WhatsApp — a maioria vai abrir no celular, e boa parte no meio do expediente
- Fontes com `display: swap`, Gantari via `next/font`
- Botão fixo no rodapé em mobile ("Garantir minha vaga") a partir do momento em que o hero sai da tela

**Reaproveitamento entre turmas**
Data, horário e número de vagas devem ficar em um único objeto de configuração, não espalhados pelo JSX. A cada nova turma se troca uma variável, não seis trechos de texto.

---

## 6. Pendências antes de publicar

1. **Data da turma 1** — trava a página inteira, aparece em sete lugares
2. **Sobrenome do Jean** e as duas fotos
3. **Número de WhatsApp** que recebe as mensagens da página de obrigado
4. **Link do Zoom** para o arquivo .ics
5. **Condição de oferta do fim do workshop** — não aparece nesta página, mas define o texto da mensagem de confirmação e do follow-up. Das três opções discutidas, minha recomendação continua sendo o onboarding assistido incluído para quem fecha em 48h.
