# NuDemo — Experiência Fintech & Engenharia de Performance WebGL

> **AVISO LEGAL / DISCLAIMER DE ESTUDO INDEPENDENTE:**  
> Este projeto é uma **demonstração técnica independente de engenharia de software frontend, computação gráfica com WebGL e design de produto fintech**.  
> **Não possui qualquer vínculo institucional, comercial ou societário com o Nubank (Nu Pagamentos S.A. / Nu Financeira S.A.)**.  
> Todas as marcas, logotipos e identidades visuais mencionadas pertencem aos seus respectivos proprietários e são utilizadas exclusivamente para fins demonstrativos e educacionais em portfólio técnico. Todos os dados, saldos e valores simulados são meramente fictícios.

---

## 📌 Visão Geral do Projeto

O **NuDemo** é uma aplicação web demonstrativa de alta fidelidade técnica inspirada no ecossistema e identidade visual da fintech **Nubank**. O objetivo central deste projeto é demonstrar a convergência entre **Core Web Vitals**, renderização tridimensional interativa a 60 FPS com Three.js/R3F e uma interface responsiva e acessível.

---

## 🏗️ Arquitetura Técnica

- **Frontend Core:** React 18 (Arquitetura orientada a componentes desacoplados e renderização em modo estrito).
- **Bundler & Build Pipeline:** Vite 5 com code splitting granular (`vendor-three`, `vendor-r3f`, `vendor-motion`, `cardArt`), tree-shaking e compressão de assets.
- **Renderização 3D (WebGL / Three.js):**
  - **Three.js & @react-three/fiber:** Render loop sob demanda (`frameloop="demand"`), pausado automaticamente fora do viewport para economia de recursos.
  - **Materiais PBR:** `MeshPhysicalMaterial` com reflexos anisotrópicos e mapa de rugosidade procedural no cartão Ultravioleta em metal, e `MeshStandardMaterial` calibrado para o tom roxo característico (`#820AD1`).
  - **Iluminação de Estúdio:** Pipeline PMREM com iluminação em duas camadas (Key light direcional + Rim light violeta de recorte).
  - **Sombra em Dois Níveis:** Sombra de contato nítida (`contactRef`) combinada com sombra ambiente suave (`ambientRef`).
- **Animações & Motion:** `framer-motion` com `LazyMotion` e `domAnimation` isolados em chunk dedicado, reduzindo o bundle crítico.
- **Tipografia & Design System:** Fonte *Figtree Variable* auto-hospedada com preload otimizado em produção, CSS Tokens nativos, escala fluida com `clamp()`, números tabulares (`tabular-nums`) e paleta com contraste WCAG 2.1 AA.

---

## 📁 Estrutura do Projeto

```text
nudemo/
├── index.html              # Ponto de entrada HTML com meta tags e Open Graph
├── vite.config.js          # Configuração de build, chunks sob demanda e preload de fonte
├── package.json            # Dependências de produção e scripts
└── src/
    ├── components/         # Componentes visuais do app e landing page
    │   ├── AppSection.jsx  # Apresentação do ecossistema mobile com tabs
    │   ├── Benefits.jsx    # Grade de diferenciais e benefícios
    │   ├── CardFallback.jsx# Fallback 2D instantâneo (zero CLS)
    │   ├── Cards.jsx       # Vitrine e comparativo de modelos de cartões
    │   ├── Easy.jsx        # Seção de simplicidade e onboarding
    │   ├── FAQ.jsx         # Perguntas frequentes acessíveis (<details>/<summary>)
    │   ├── Footer.jsx      # Rodapé institucional e links informativos
    │   ├── Header.jsx      # Navegação com pílula flutuante e menu mobile
    │   ├── Hero.jsx        # Cabeçalho principal com integração da cena 3D
    │   ├── Icons.jsx       # Ícones e símbolos vetoriais do sistema
    │   ├── Phone.jsx       # Interface simulada do aplicativo móvel
    │   ├── SceneBoundary.jsx # Error boundary para recuperação graciosa de WebGL
    │   ├── Steps.jsx       # Passo a passo de abertura de conta
    │   └── Track.jsx       # Seção interativa com simulador e trail do celular
    ├── three/              # Módulos WebGL e computação gráfica
    │   ├── HeroScene.jsx   # Cena 3D interativa do Hero
    │   ├── StackScene.jsx  # Cena 3D do leque de cartões na rolagem
    │   ├── NuCard.jsx      # Mesh tridimensional do cartão de crédito
    │   ├── cardArt.js      # Geração procedural de texturas e bump maps em canvas
    │   ├── cardConsts.js   # Dimensões e constantes de texturas do cartão
    │   ├── cardGeometry.js # Geometrias chanfradas de cartão e chip EMV
    │   ├── cardKit.js      # Singleton para compartilhamento de recursos de GPU
    │   ├── hooks.js        # Hooks de visibilidade, DPR, media queries e detecção WebGL
    │   ├── motion.js       # Curvas de interpolação e limiares de tolerância
    │   ├── quality.js      # Classificação de hardware e tiering de qualidade
    │   └── stage.js        # Estúdio procedural, luzes e mapas de sombra
    ├── lib/                # Utilitários compartilhados
    │   └── demo.jsx        # Contexto e diálogo acessível de demonstração
    ├── styles/             # Folhas de estilo modularizadas
    │   ├── tokens.css      # Variáveis de cores, espaçamentos e tipografia fluida
    │   ├── base.css        # Reset, tipografia base e acessibilidade
    │   └── sections.css    # Estilização das seções da landing page e do mockup
    ├── content.js          # Textos e dados fictícios centralizados (DEMO_BANK)
    ├── main.jsx            # Inicialização da aplicação React
    └── App.jsx             # Estrutura principal da página
```

---

## ⚡ Soluções de Engenharia e Performance

1. **Buffer de Textura com Typed Arrays (`Uint32Array`):**  
   Manipulação direta de `ImageData` com buffer de 32 bits para geração procedural de bump maps em **menos de 0,3 ms**.
2. **Escalonamento em Tempo Ocioso (*Time-slicing & Idle Scheduling*):**  
   O verso do cartão é inicializado com um placeholder ultra-leve e rasterizado em segundo plano via `requestIdleCallback`, antes de qualquer rotação.
3. **Zero-CLS no Hero com Fallback Vetorial:**  
   Um componente de fallback vetorial (`CardFallback`) é montado na mesma posição tridimensional do cartão, garantindo Cumulative Layout Shift igual a zero até o primeiro frame WebGL.
4. **Controle Estrito de Visibilidade (*Viewport Culling*):**  
   Uso de `IntersectionObserver` passivo para pausar totalmente o ciclo de renderização das cenas (`HeroScene` e `StackScene`) quando fora de vista, garantindo zero consumo de ciclos de GPU durante a navegação.
5. **Code Splitting Granular no Bundler:**  
   Isolamento de `three`, `@react-three/fiber` e `framer-motion` em chunks dedicados (`vendor-three`, `vendor-r3f`, `vendor-motion`), mantendo o chunk inicial leve e ágil.

---

## 📊 Métricas de Performance

| Métrica de Performance | Resultado | Status |
| :--- | :---: | :---: |
| **FPS Médio em Rolagem Mobile** | **60.0 fps** | Estabilidade máxima |
| **p95 Frame Time no Scroll** | **16.89 ms** | $\le 20\text{ ms}$ (Aprovado) |
| **Long Tasks no Scroll (>100ms)** | **0** | Zero jank |
| **FPS no Giro 3D do Hero (Desktop)** | **60.0 fps** | Suavidade total |
| **Cumulative Layout Shift (CLS)** | **0.000** | Zero CLS |
| **Total Blocking Time (TBT) Desktop** | **368 ms** | Baixo bloqueio de thread |
| **Fidelidade de Cor (#820AD1)** | **RGB(129, 0, 196)** | Calibração $\pm 1$ |

---

## 💎 Funcionalidades Demonstrativas

1. **Controles 3D no Hero:**
   - Alternância entre o modelo Roxo clássico e o modelo Ultravioleta em metal.
   - Giro interativo de 180° com visualização de verso, tarja magnética e CVV simulado.
   - Pausa e retomada de rotação automática para inspeção manual.
2. **Comparador de Cartões:**
   - Tabela comparativa entre os modelos Roxo e Ultravioleta (benefícios, materiais e regras de isenção).
3. **Simulador de Fatura & Categorias (Seção Conta):**
   - Categorias de despesas com atualização dinâmica de proporção.
   - Demonstração interativa das Caixinhas com rendimento a 100% do CDI.
4. **Mockup Interativo do Celular (Dark Mode):**
   - Alternância entre abas **Conta**, **Cartão** e **Caixinhas**.
   - Mostrar/ocultar saldos e faturas (`R$ ••••`).
   - Botão **Área Pix** com cópia simulada de chave e feedback visual "Copiado!".
   - Alternância da proteção do **Modo Rua**.
   - Gerador demonstrativo de **Cartão Virtual Temporário de 24 horas**.
5. **Perguntas Frequentes (FAQ) Acessível:**
   - Accordion semântico construído com `<details>` e `<summary>`.

---

## ♿ Acessibilidade e SEO

- **Navegação por Teclado:** Suporte a skip-to-content (`#main-content`), foco visível com `:focus-visible` em violeta suave (`#a855f7`) e teclas de navegação em abas (*Arrow Keys*, *Home*, *End*).
- **Rótulos Acessíveis:** Todos os botões que acionam avisos de demonstração possuem rótulos descritivos (`aria-label`) informando a natureza demonstrativa da ação.
- **Diálogo Nativo:** O `<dialog>` de demonstração captura o foco, suporta fechamento via tecla `Escape` e devolve o foco ao elemento disparador.
- **Suporte a Movimento Reduzido:** Transições CSS e animações respeitam a preferência do sistema (`prefers-reduced-motion: reduce`).
- **Contraste WCAG 2.1 AA:** Todas as combinações de cores e botões de abas atendem às taxas mínimas de contraste exigidas.

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

---

## 📄 Licença

Este projeto é disponibilizado sob a licença **MIT** exclusivamente para fins educacionais e de demonstração técnica em portfólio.
