# Briefing — Site do ady

**Para:** Kaio (desenvolvimento)
**De:** Rafael / Click Hero
**Domínio:** useady.com.br
**Stack:** Next.js (App Router) + Vercel · repositório novo, separado do `clickhero-site`

---

## 0. O que este site é e o que ele não é

O site vende o **ady** para o **dono de negócio local** — supermercado, clínica odontológica, barbearia, revenda de carros, academia. Não vende para agência, não vende para social media, não vende para quem já anuncia.

O CTA é único no site inteiro: **preencher o formulário**. O lead cai no Bitrix24 e a ativação é feita por WhatsApp, manualmente. Não existe cadastro self-service nesta fase — nenhum botão pode sugerir que existe.

### Regras de linguagem (valem para toda a copy)

Nunca aparecem no site: tráfego pago, CPM, CTR, ROAS, CPA, conversão, pixel, gerenciador de anúncios, segmentação, landing page, campanha (como termo técnico), plataforma, SaaS, solução.

Usar no lugar: clientes, resultado, quanto custou cada cliente novo, quanto voltou do que você investiu, aparecer, ser encontrado, anúncio.

Tom: confiante e acolhedor, direto, proativo. Nunca arrogante, nunca técnico, nunca robótico. O ady é um aliado competente — não uma ferramenta poderosa.

O nome é sempre **ady**, minúsculo, inclusive em início de frase quando possível reescrever.

---

## 1. Estrutura de páginas — fase 1

| Rota | Função |
|---|---|
| `/` | Home longa, 11 seções, conversão |
| `/obrigado` | Confirmação de lead + próximo passo |
| `/roadmap` | Versão pública do roadmap |
| `/privacidade` | Política de privacidade (LGPD) |
| `/termos` | Termos de uso |

`/webinar` fica de fora deste briefing — é uma landing isolada, sem menu e sem rodapé de navegação, que recebe briefing próprio depois.

Fora do escopo da fase 1: blog, páginas por nicho, página de parceiros, página do Click Auditor.

---

## 2. Sistema visual

Direto do Guia de Marca — ady v1.0. Sem interpretação.

```
--ady-bg:        #0C0D0A   fundo escuro (padrão do site inteiro)
--ady-neutral:   #ECEDEF   texto e superfícies claras
--ady-accent:    #1E88A8   petróleo — SOMENTE sobre fundo escuro
--ady-accent-lt: #17708A   petróleo — SOMENTE sobre fundo claro
--ady-spark:     #CF6F03   faísca — elemento pequeno e contido
```

**Hierarquia inegociável:** petróleo é o acento dominante — botões, links, estados selecionados, anel de foco, barras de progresso, ícones ativos. Laranja é **apenas a faísca**: o ponto acima do símbolo, no máximo um detalhe pontual. Nenhum botão laranja. Nenhum título laranja. Nenhum bloco de fundo laranja.

**Contraste:** `#1E88A8` só sobre escuro, `#17708A` só sobre claro. Nunca inverter — reprova WCAG AA.

**Tipografia:** Gantari (Light 300, Regular 400, Medium 500, SemiBold 600). Carregar como fonte local via `next/font/local`, não por CDN do Google.

**Logo:** `ady-lockup-horizontal.svg` no topo. Favicon com faísca integrada (`ady-favicon.ico`). Todos os arquivos estão na pasta `assets/` do guia.

---

## 3. Copy final — Home

Copy pronta para implementar. Textos entre colchetes com prefixo IMG/VIDEO são espaços de mídia — spec completa na seção 4.

---

### Seção 1 — Hero

**Título**
Seu negócio aparecendo todo dia.
Sem depender de ninguém pra isso.

**Subtítulo**
O ady cria os posts, publica no seu Instagram e coloca seus anúncios no ar. Você toca o negócio. Ele cuida de te mostrar.

**Botão**
Quero o ady no meu negócio

**Linha de apoio abaixo do botão**
A partir de R$ 69 por mês. Sem fidelidade, sem contrato.

`[IMG-01]`

---

### Seção 2 — O problema

**Título**
Você já pagou alguém pra cuidar disso.

**Corpo**
E aí veio a fatura no fim do mês. Veio o print de um post que você não pediu. Veio "esse mês o alcance caiu um pouco".

Você pediu pra trocar uma foto numa segunda. Ela foi trocada na quinta.

No fim do ano você olhou pra trás e não soube dizer o que aquele dinheiro fez pelo seu negócio. Não porque a pessoa era ruim. Porque você nunca teve como saber.

**Fecho**
O ady não some, não atrasa e não te manda relatório que você precisa decifrar. Ele trabalha todo dia e te mostra o que aconteceu em português.

`[IMG-02]` `[IMG-03]`

---

### Seção 3 — Como funciona

**Título**
Três passos. Depois disso é com ele.

**Passo 1 — Conectar**
Você conecta seu Instagram. Leva dois minutos e a gente faz junto com você pelo WhatsApp.

**Passo 2 — Contar o que seu negócio faz**
Seu nome, o que você vende, quem é seu cliente, sua logo e suas cores. É só uma vez.

**Passo 3 — O ady assume**
Ele monta o mês inteiro de conteúdo, cria os posts, publica na hora certa e coloca seus anúncios no ar. Você não precisa abrir nada.

`[IMG-04]` `[IMG-05]` `[IMG-06]`

---

### Seção 4 — O que o ady faz

**Título**
O que ele faz enquanto você atende.

**Bloco 1 — Escreve seus posts**
Ele sabe o que seu negócio vende e escreve na sua voz. Nada de texto genérico que serve pra qualquer um.
`[IMG-07]`

**Bloco 2 — Cria as imagens**
Com a sua logo, as suas cores e a sua cara. Sem designer, sem banco de imagem, sem Canva às onze da noite.
`[IMG-08]`

**Bloco 3 — Monta o mês inteiro**
Ele planeja o calendário completo de conteúdo. Você abre e já está tudo lá, pronto.
`[IMG-09]`

**Bloco 4 — Publica sozinho**
No dia certo, no horário certo, no seu Instagram. Você não precisa lembrar de nada.
`[IMG-10]`

**Bloco 5 — Coloca seus anúncios no ar**
Ele cria o anúncio, escolhe quem vai ver e acompanha se está dando gente. Se não estiver, ele mexe.
`[IMG-11]`

**Bloco 6 — Te mostra o que deu certo**
Quanta gente viu, quanta gente chamou, quanto custou cada cliente novo. Em números que fazem sentido.
`[IMG-12]`

---

### Seção 5 — Ver funcionando

**Título**
É mais fácil ver do que explicar.

**Subtítulo**
Um minuto e meio mostrando o ady montando o mês de conteúdo de uma barbearia.

`[VIDEO-01]`

---

### Seção 6 — Quem está por trás

**Título**
Eu passei anos do outro lado.

**Corpo**
Sou o Rafael, fundador da Click Hero. Durante anos eu operei marketing pra dezenas de negócios como o seu, e vi de perto por que esse modelo não funciona pro pequeno: custa caro demais pra ser justo com quem está começando, e depende de gente demais pra ser constante.

Não dava pra consertar isso contratando mais pessoas. Então a gente construiu o ady.

Ele não é um assistente que te dá dicas. É quem faz. E custa uma fração do que você pagaria pra alguém fazer pior.

`[IMG-13]`

---

### Seção 7 — Comparativo

**Título**
Compare com o que você faz hoje.

| | Contratar alguém | Fazer sozinho | ady |
|---|---|---|---|
| **Quanto custa por mês** | R$ 500 a R$ 2000 | Seu tempo | A partir de R$ 69 |
| **Quanto do seu tempo consome** | Reuniões, cobranças, aprovações | Toda noite depois que fecha | Praticamente zero |
| **Quando você viaja uma semana** | Depende se a pessoa lembrar | Não sai nada | Continua publicando |
| **Você entende o resultado** | Relatório que precisa ser explicado | Você chuta | Em números do seu negócio |
| **Quanto tempo pra começar** | Semanas | Nunca é hoje | Mesmo dia |

---

### Seção 8 — Planos

**Título**
Dois planos. Escolha pelo que você precisa agora.

**Plano 1 — ady Social**
R$ 69 por mês

Pra quem precisa estar aparecendo com constância:
➜ Planejamento do seu mês de conteúdo
➜ Posts criados e publicados no Instagram
➜ Até 8 posts por mês
➜ Suporte no WhatsApp

Botão: Começar com o Social

**Plano 2 — ady Completo** *(destaque)*
R$ 297 por mês

Pra quem quer aparecer e trazer cliente novo:
➜ Tudo do plano Social
➜ Seus anúncios criados e no ar
➜ Até 30 imagens por mês
➜ Até 2 anúncios rodando ao mesmo tempo
➜ Acompanhamento do que cada cliente novo custou
➜ Suporte no WhatsApp

Botão: Quero o Completo

**Nota abaixo dos cards** (obrigatória, não remover)
O valor que você investe nos anúncios é pago direto pra Meta, na sua própria conta, e não passa pela gente. Você decide quanto quer investir e pode mudar quando quiser.

---

### Seção 9 — Perguntas

**Preciso entender de marketing ou de anúncio?**
Não. Se você souber dizer o que seu negócio vende e pra quem, está resolvido. O resto é com o ady.

**E se ele publicar alguma coisa que eu não gosto?**
Você tem acesso a tudo antes e depois. Se quiser mudar, muda. Se preferir olhar tudo antes de sair, dá pra configurar assim. Só que a maioria das pessoas deixa ele tocar sozinho depois da primeira semana.

**Além da mensalidade, quanto vou gastar de anúncio?**
Isso é decisão sua e o dinheiro sai da sua conta direto pra Meta. Negócios locais costumam começar com algo entre R$ 15 e R$ 30 por dia. Dá pra começar menor e aumentar quando vir resultado.

**A conta do Instagram e a conta de anúncio são minhas?**
Suas. O ady trabalha dentro das suas contas. Se um dia você sair, tudo continua com você.

**Funciona pro meu tipo de negócio?**
Ele foi feito pra negócio local que atende gente da região: supermercado, clínica, barbearia, academia, loja de carro, pet shop, restaurante. Se o seu cliente mora perto de você, funciona.

**Tem fidelidade?**
Não. Você cancela quando quiser, sem multa.

**Quanto tempo até começar a rodar?**
No mesmo dia. A gente conecta suas contas com você pelo WhatsApp e o ady já começa a montar seu conteúdo.

---

### Seção 10 — Roadmap

**Título**
O ady está só começando.

**Corpo**
Ele já cria, publica e anuncia no Instagram. O que vem a seguir:

**Em breve — Google**
Aparecer também quando alguém pesquisar pelo seu tipo de negócio na sua região.

**Depois — WhatsApp**
Pedir qualquer coisa pro ady por mensagem, sem abrir nenhuma tela.

**Depois — Ele te conhecendo melhor**
Quanto mais tempo junto, mais ele acerta no que sugere pro seu negócio.

**Link**
Ver o roadmap completo → `/roadmap`

---

### Seção 11 — CTA final

**Título**
Seu concorrente aparece todo dia. Você também pode.

**Subtítulo**
Deixe seus dados e a gente conecta seu ady hoje mesmo.

**Botão**
Quero o ady no meu negócio

**Rodapé**
ady é um produto Click Hero.
Links: Roadmap · Privacidade · Termos · Instagram
CNPJ e razão social conforme dados legais.

---

## 4. Especificação de assets

Todas as capturas de tela são do produto real, já com a identidade nova (escuro + petróleo). Nada de mockup fictício ou tela inventada.

| ID | Descrição | Dimensão | Formato |
|---|---|---|---|
| IMG-01 | Painel do ady em notebook + celular, fundo `#0C0D0A`, leve perspectiva | 1600×1000 | WebP + fallback |
| IMG-02 | Cena do problema: caixa de mensagem de WhatsApp sem resposta / fatura. Tom cinza, frio, sem identidade ady | 800×600 | WebP |
| IMG-03 | Tela do ady no mesmo enquadramento de IMG-02, escura e limpa — contraste lado a lado | 800×600 | WebP |
| IMG-04 | Tela de conexão de conta | 800×600 | WebP |
| IMG-05 | Tela de cadastro do negócio (nome, segmento, logo, cores) | 800×600 | WebP |
| IMG-06 | Calendário de conteúdo montado, mês cheio | 800×600 | WebP |
| IMG-07 | Texto de post gerado pela IA | 1000×750 | WebP |
| IMG-08 | Imagem gerada com identidade do cliente aplicada | 1000×750 | WebP |
| IMG-09 | Planejador mensal | 1000×750 | WebP |
| IMG-10 | Agendamento / publicação no Instagram | 1000×750 | WebP |
| IMG-11 | Criação de anúncio | 1000×750 | WebP |
| IMG-12 | Painel de resultados com números | 1000×750 | WebP |
| IMG-13 | Foto real do Rafael, ambiente escuro, olhando pra câmera | 900×1100 | WebP |
| VIDEO-01 | Gravação de tela, 60 a 90s, sem locução, legendado, exemplo de barbearia | 1920×1080 | MP4 + poster |

**Nichos para rotacionar nos exemplos de tela:** supermercado, clínica odontológica, barbearia (principais) · revenda de carros e academia (secundários).

**Vídeo:** hospedar no Vercel Blob ou Mux, nunca embed do YouTube na home (marca de terceiro + peso). Poster estático obrigatório, autoplay desligado, `preload="none"`.

**Enquanto os assets não existem:** implementar todos os slots com placeholder de proporção correta e `aspect-ratio` fixo, pra não haver deslocamento de layout quando a mídia entrar.

---

## 5. Especificação técnica

### Repositório e deploy
Repositório novo em `clickhero2026`, sugestão `ady-site`. Deploy na Vercel, domínio `useady.com.br` com `www` redirecionando para raiz.

### Formulário → Bitrix24

Um único formulário, aberto em modal a partir de qualquer CTA da página.

Campos:
- Nome (obrigatório)
- WhatsApp com máscara (obrigatório)
- Nome do negócio (obrigatório)
- Segmento (select: Supermercado / Clínica odontológica / Barbearia ou salão / Revenda de carros / Academia / Restaurante / Pet shop / Outro)
- Plano de interesse (preenchido automaticamente conforme o botão clicado; editável)

Envio via API route do Next (`/api/lead`), nunca direto do cliente — a chave do Bitrix não pode aparecer no bundle. Validação no servidor. Após sucesso, redirecionar para `/obrigado`.

### Página /obrigado
Confirmação curta + botão que abre conversa no WhatsApp com mensagem pré-preenchida. É aqui que o Pixel dispara o evento de conversão.

### Meta Pixel
Instalado desde o primeiro deploy, na conta de anúncios do ady.
- `PageView` em todas as páginas
- `ViewContent` ao entrar a seção de planos no viewport
- `InitiateCheckout` ao clicar em qualquer botão de plano
- `Lead` apenas em `/obrigado`

### SEO
Title, description e Open Graph próprios por página. Imagem OG 1200×630 com lockup do ady sobre fundo escuro. `sitemap.xml` e `robots.txt`. Sem `noindex` em nada da fase 1.

### Performance
Alvo: LCP abaixo de 2,5s no 4G. Imagens via `next/image`, lazy load em tudo abaixo da dobra, fonte com `display: swap`. A home é longa — priorizar carregamento progressivo.

### Responsividade
Mobile-first de verdade. O dono de negócio local abre no celular, entre um atendimento e outro. Testar em tela de 360px de largura antes de considerar pronto.

### Acessibilidade
Contraste conforme regra da seção 2 deste briefing. Anel de foco visível em petróleo. `alt` descritivo em todas as imagens de produto. Navegação completa por teclado no modal do formulário.

---

## 6. Ordem de execução sugerida

1. Repositório, deploy vazio no domínio, tokens de cor e fonte configurados
2. Estrutura das 11 seções com copy final e placeholders de mídia
3. Formulário + API route + Bitrix24 + `/obrigado`
4. Meta Pixel e eventos
5. `/roadmap` e páginas legais
6. Substituição dos placeholders pelos assets reais
7. Revisão de performance, mobile e contraste
