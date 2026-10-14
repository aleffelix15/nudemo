# nudemo — Nubank Experience (React + Vite + Three.js)

Recriação e refatoração de alta precisão da experiência digital do Nubank, combinando modelagem 3D física em tempo real com React Three Fiber, interface fluida com Framer Motion, design system escuro e acessibilidade WCAG AA.

> [!NOTE]
> **Aviso Legal:** Projeto demonstrativo independente, sem vínculo oficial com o Nubank. Nomes, marcas e referências visuais pertencem aos seus respectivos titulares. Todos os dados e valores apresentados são estritamente fictícios.

---

## ✨ Funcionalidades e Destaques

- **Cartão 3D Físico Vertical (PBR)**: Geometria em padrão ISO/IEC 7810 ID-1 ($1 : 1.5858$), material `MeshPhysicalMaterial` com acabamento roxo acetinado metálico, chanfro microscópico e chip EMV prateado com relevo de contatos elétricos.
- **Identidade Visual Autêntica**: Marcador de bandeira em duas circunferências sobrepostas (representação gráfica genérica de marca de pagamento de terceiros), gravação do titular (*Gabriela Lima*), chip EMV em ouro/champagne e logotipo oficial `nu` com fita contínua translúcida extraído da referência oficial.
- **Motion Design Suave e Amortecido**: Rotação orientada pelo scroll com `THREE.MathUtils.damp`, inclinação por movimento do cursor limitada a $\pm 8^\circ$ e suporte completo a `prefers-reduced-motion: reduce`.
- **Mockup do Aplicativo**: Integração da interface real do app Nubank em Modo Escuro sem vazamento de bordas, além de seletor interativo para visualização do ecossistema Conta & Cartão.
- **Design System e Acessibilidade**: Paleta sóbria (`#070709`, `#121216`, `#820AD1`), tipografia com números tabulares (`tabular-nums`), contraste de texto superior a 14:1 e estados `:focus-visible` claros.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (v18+)
- npm ou pnpm

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento (Vite)
npm run dev

# 3. Gerar build otimizado para produção
npm run build
```

---

## 🛠️ Tecnologias Utilizadas

- **React 18** & **Vite 5**
- **Three.js** & **@react-three/fiber**
- **Framer Motion**
- **Figtree Variable Font**
- **CSS Moderno (Tokens, Grid, Clamp)**
