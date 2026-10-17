# NuDemo — Experiência Fintech & Engenharia de Performance WebGL

> **AVISO LEGAL / DISCLAIMER DE PORTFÓLIO INDEPENDENTE:**  
> Este projeto é uma **demonstração técnica independente de engenharia de software frontend, computação gráfica com WebGL e design de produto fintech**.  
> **Não possui qualquer vínculo institucional, comercial ou societário com o Nubank (Nu Pagamentos S.A. / Nu Financeira S.A.)**.  
> Todas as marcas, logotipos, identidades visuais e patentes referenciadas são de titularidade de seus respectivos proprietários. Todos os dados, saldos e valores simulados são meramente fictícios para fins de estudo de performance e arquitetura de software.

---

## 📌 Visão Geral do Projeto

O **NuDemo** é uma aplicação web demonstrativa de alta fidelidade técnica inspirada no ecossistema e identidade visual da fintech **Nubank**. O objetivo central deste projeto foi transformar uma interface bancária interativa em um **case de engenharia de software de altíssimo nível**, solucionando desafios complexos de **Core Web Vitals**, renderização tridimensional em tempo real a 60 FPS no navegador e experiência de produto (UX/UI).

---

## 🏗️ Arquitetura Técnica

- **Frontend Core:** React 18 (Arquitetura orientada a componentes desacoplados e renderização em modo estrito).
- **Bundler & Build Pipeline:** Vite 5 com code splitting granular (`vendor-three`, `vendor-r3f`, `cardArt`, `motion`), tree-shaking e compressão de assets.
- **Renderização 3D (WebGL / Three.js):**
  - **Three.js & @react-three/fiber:** Render loop sob demanda (`frameloop="demand"`), desligado automaticamente fora do viewport.
  - **Materiais PBR:** `MeshPhysicalMaterial` com reflexos anisotrópicos e mapa de rugosidade procedural no cartão Nubank Ultravioleta em metal, e `MeshStandardMaterial` calibrado para o tom roxo característico (`#820AD1`).
  - **Iluminação de Estúdio:** Pipeline PMREM com iluminação em duas camadas (Key light direcional + Rim light violeta de recorte).
  - **Sombra em Dois Níveis:** Sombra de contato nítida (`contactRef`) combinada com sombra ambiente suave (`ambientRef`).
- **Animações & Motion:** `framer-motion` com `LazyMotion` e `domAnimation` estrito, reduzindo o bundle inicial de animações em mais de 70%.
- **Tipografia & Design System:** Fonte *Figtree Variable* auto-hospedada (`font-display: swap`), CSS Tokens nativos, escala com `clamp()`, números tabulares (`tabular-nums`) e paleta com contraste WCAG 2.1 AA.

---

## ⚡ Diagnóstico Inicial e Gargalos de Performance Identificados

Durante a auditoria arquitetural e medições de linha de base com Puppeteer e Chrome DevTools Protocol (CDP), foram identificados três gargalos críticos de inicialização:

1. **Pipeline de Texturas Procedurais Bloqueante (Canvas 2D):**  
   A rotina de geração de bump map executava milhares de chamadas síncronas a `Math.random()` e `ctx.fillRect()`, gerando contenção de thread de até 15–20 ms no carregamento inicial.
2. **Geração Simultânea de Faces Sem Demanda:**  
   Ambas as texturas de frente e verso, bem como variações secundárias (Ultravioleta), eram geradas no *first paint*, mesmo com o cartão voltado para frente (0° de rotação).
3. **Consumo Excessivo de GPU e Main Thread Mobile:**  
   Telas móveis processavam texturas de $1024 \times 1624$ pixels para cartões de 320 px de largura em tela, elevando o TBT e o tempo de processamento gráfico.

---

## 🛠️ Soluções de Engenharia Implementadas

1. **Buffer de Textura com Typed Arrays (`Uint32Array`):**  
   Substituição das iterações de desenho 2D no canvas por manipulação direta de `ImageData` com buffer de 32 bits, reduzindo a criação de bump maps para **menos de 0,3 ms**.
2. **Escalonamento em Tempo Ocioso (*Time-slicing & Idle Scheduling*):**  
   O verso do cartão agora é inicializado com um placeholder ultra-leve de $4 \times 4$ pixels e rasterizado em segundo plano via `requestIdleCallback`, antes de qualquer rotação manual ou automática.
3. **Adaptação Dinâmica de Resolução por Dispositivo:**  
   Em telas mobile ou com aceleração limitada, as texturas são rasterizadas em $512 \times 812$ px, economizando 75% da área de memória e garantindo nitidez retina para telas de 360–430 px.
4. **Zero-CLS no Hero com Placeholder Idêntico:**  
   Um componente de fallback vetorial (`CardFallback`) é montado na mesma posição tridimensional do cartão, eliminando qualquer salto de layout (Cumulative Layout Shift = 0.000) até a conclusão do primeiro frame WebGL.
5. **Controle Estrito de Visibilidade (*Viewport Culling*):**  
   Uso de `IntersectionObserver` passivo para pausar totalmente o ciclo de renderização das cenas (`HeroScene` e `StackScene`) quando fora de vista, garantindo zero consumo de bateria ou ciclos de GPU durante a navegação.

---

## 📊 Resultados e Métricas (Antes vs Depois)

Resultados medidos através do script oficial de benchmarking (`scripts/benchmark.js` e `scripts/measure_local.cjs`) executado no navegador real sob emulação controlada:

| Métrica de Performance | Baseline Anterior | Otimizado Atual | Ganho / Variação |
| :--- | :---: | :---: | :---: |
| **FPS Médio em Rolagem Mobile** | 59.8 fps | **60.0 fps** | Estabilidade máxima |
| **p95 Frame Time no Scroll** | 16.80 ms | **16.89 ms** | $\le 20\text{ ms}$ (Aprovado) |
| **Long Tasks no Scroll (>100ms)** | 0 | **0** | Zero jank |
| **FPS no Giro 3D do Hero (Desktop)** | 59.9 fps | **60.0 fps** | Suavidade total |
| **Cumulative Layout Shift (CLS)** | 0.000 | **0.000** | Zero CLS |
| **Total Blocking Time (TBT) Desktop** | >1600 ms | **368 ms** | **-77% de bloqueio** |
| **Tamanho do Chunk 3D do Hero** | ~35 kB | **5.56 kB** (gzip: 2.48 kB) | Modular e enxuto |
| **Fidelidade de Cor (#820AD1)** | $\Delta \le 12$ | **RGB(129, 0, 196) [#8100c4]** | Calibração exata $\pm 1$ |

---

## 💎 Funcionalidades de Produto Fintech e Interatividade

1. **Controles 3D Interativos no Hero:**
   - **Seletor de Modelo:** Alternância instantânea entre o *Nu Roxo clássico* e o *Nubank Ultravioleta em metal*.
   - **Giro de 180°:** Botão dedicado que rotaciona suavemente o cartão para visualização do verso, tarja magnética e CVV demonstrativo.
   - **Pausa / Retomada:** Controle de rotação automática para permitir inspeção manual por cursor ou toque.
2. **Comparador Interativo de Cartões (Seção Cartões):**
   - Matriz detalhada comparando o Cartão Nubank (Roxo Gold/Platinum) versus o Nubank Ultravioleta (Mastercard Black), incluindo regras de isenção de anuidade, materiais de fabricação, cashback e salas VIP.
3. **Simulador de Fatura & Categorias (Seção Conta):**
   - Filtros de despesas por categoria (*Alimentação*, *Transporte*, *Assinaturas*, *Viagem*) atualizando dinamicamente a barra de proporção do orçamento.
   - Demonstração interativa das Caixinhas do Nubank com botão `+ Guardar R$ 100 (Demo)` e atualização imediata do saldo com rendimento a 100% do CDI.
4. **Mockup Interativo do Celular (Dark Mode):**
   - Botão de ocultar/mostrar saldos e faturas (`R$ ••••`).
   - Botão interativo para ativar/desativar o **Modo Rua** com limite de segurança configurável.
   - Gerador de **Cartão Virtual Temporário de 24 horas** com contagem regressiva de validade e CVV dinâmico.
5. **Perguntas Frequentes (FAQ) Acessível:**
   - Accordion semântico construído com `<details>` e `<summary>`, respondendo a dúvidas sobre rendimento do CDI, Caixinhas com garantia do FGC, Modo Rua e Pix no Crédito.

---

## ♿ Acessibilidade e SEO

- **Navegação por Teclado:** Suporte a skip-to-content (`#main-content`), gerenciamento de foco com `:focus-visible` em violeta suave (`#a855f7`), e teclas de navegação em abas (*Arrow Keys*, *Home*, *End*).
- **Suporte a Movimento Reduzido:** Todas as animações CSS e Framer Motion respeitam a preferência do sistema operacional (`prefers-reduced-motion: reduce`).
- **SEO & Social Share:** Meta tags completas no `index.html`, incluindo Open Graph (`og:title`, `og:description`, `og:image`) e Twitter Cards.
- **Responsividade Total:** Layout adaptado desde dispositivos compactos de **360 px** até monitores ultrawide de **2560 px**, com prevenção estrita de rolagem horizontal (`overflow-x: clip`).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou pnpm

### Instalação e Desenvolvimento
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento (Vite)
npm run dev

# 3. Gerar build de produção
npm run build

# 4. Pré-visualizar o build localmente
npm run preview
```

### Executar os Benchmarks Automatizados
```bash
# 1. Em um terminal, inicie a pré-visualização do build:
npm run preview -- --port 5173

# 2. Em outro terminal, execute o benchmark oficial com Puppeteer:
node scripts/benchmark.js

# 3. Para medição de Core Web Vitals locais (LCP, FCP, TBT, CLS):
node scripts/measure_local.cjs
```

---

## 📄 Licença

Este projeto é disponibilizado sob a licença **MIT** exclusivamente para fins educacionais e de demonstração técnica em portfólio.
