// Conteúdo demonstrativo calibrado com o ecossistema fintech Nubank.
// Valores e nomes são demonstrativos para fins de portfólio de engenharia de software.

export const DEMO_BANK = {
  user: {
    greeting: 'Olá, Gabriela',
    avatarLabel: 'Perfil de Gabriela',
  },
  account: {
    balance: 'R$ 1.518,38',
    balanceHidden: '••••••••',
    cdiTag: 'Rendimento automático 100% do CDI',
    pixKey: 'chave.demo@exemplo.com',
  },
  card: {
    invoice: 'R$ 16,44',
    invoiceSublabel: 'Fatura atual fecha em 7 dias',
    availableLimit: 'R$ 983,56',
    totalLimit: 'R$ 1.000,00',
    limitPct: '4%',
    limitNote: 'Limite disponível de R$ 983,56',
    virtualCard: {
      number: '•••• •••• •••• 4821',
      validity: '23h 59m',
      cvv: '382',
      cvvHidden: '•••',
    },
    transactions: [
      {
        id: 'tx-1',
        title: 'Supermercado Pão de Mel',
        meta: 'Hoje, 14:22 • Cartão físico',
        amount: 'R$ 12,50',
      },
      {
        id: 'tx-2',
        title: 'Padaria Central',
        meta: 'Ontem, 08:45 • Por aproximação',
        amount: 'R$ 3,94',
      },
    ],
  },
  loan: {
    available: 'R$ 50.000,00',
    badge: 'R$ 50.000',
  },
  caixinhas: {
    defaultBalance: 5240,
    yieldNote: '+R$ 48,20 de rendimento este mês',
    vacationBalance: 1740,
    vacationBalanceFormatted: 'R$ 1.740,00',
  },
  modoRua: {
    limitFormatted: 'R$ 500',
    activeText: 'Modo Rua Ativo (Limite R$ 500)',
    inactiveText: 'Modo Rua: Toque para ativar',
  },
}

export const NAV = [
  { id: 'conta', label: 'Conta' },
  { id: 'cartoes', label: 'Cartões' },
  { id: 'app', label: 'App' },
  { id: 'vantagens', label: 'Vantagens' },
  { id: 'faq', label: 'Dúvidas' },
]

export const HERO = {
  title: ['Simples, rápido', 'e sem anuidade.'],
  lead: 'Conta digital com rendimento de 100% do CDI, Caixinhas com liquidez diária e cartão de crédito sem pegadinhas. Do roxinho clássico ao Ultravioleta em metal.',
  primary: 'Abrir conta digital',
  secondary: 'Ver como funciona',
  notes: [
    { title: '100% do CDI', text: 'Seu dinheiro rendendo mais que a poupança todo dia.' },
    { title: 'Modo Rua', text: 'Proteção inteligente para transferências fora de casa.' },
  ],
}

export const CARDS = {
  title: 'Escolha o cartão ideal para você',
  lead: 'Do roxinho com anuidade zero ao acabamento em metal escovado do Ultravioleta, cada cartão tem tecnologia de ponta e controle em tempo real.',
  items: [
    {
      variant: 0,
      name: 'Cartão Nubank (Roxo)',
      badge: 'Zero Anuidade',
      tier: 'Mastercard Gold / Platinum',
      text: 'O cartão de crédito transparente e sem tarifas ocultas, controlado 100% pelo aplicativo.',
      points: [
        'Sem anuidade para sempre',
        'Nu Limite Garantido (rende 100% do CDI)',
        'Cartão Virtual Temporário (24h) para compras seguras',
        'Pix no Crédito em até 12x',
        'Bloqueio e desbloqueio instantâneo pelo app',
      ],
    },
    {
      variant: 1,
      name: 'Nubank Ultravioleta',
      badge: 'Exclusivo Metal',
      tier: 'Mastercard Black',
      text: 'Design sofisticado em metal escovado de 18g para quem busca experiências exclusivas e alta rentabilidade.',
      points: [
        'Corpo em metal pesado com gravação a laser',
        '1% de cashback instantâneo que rende 200% do CDI',
        'NuTag sem mensalidade para pedágios e estacionamentos',
        'Espaço Família compartilhado com até 4 membros',
        'Acesso à Sala VIP Lounge Mastercard Black em GRU',
      ],
    },
  ],
  action: 'Pedir cartão',
  helpTitle: 'Quer comparar os detalhes?',
  helpText: 'Veja lado a lado todos os benefícios, materiais e tarifas do Roxo e do Ultravioleta.',
  helpAction: 'Comparar cartões',
  comparison: [
    {
      feature: 'Anuidade',
      roxo: 'Grátis para sempre',
      ultra: 'Grátis com R$ 50 mil investidos ou R$ 5 mil/mês de gastos (ou R$ 49/mês)',
    },
    {
      feature: 'Material e Peso',
      roxo: 'Polímero fosco de alta resistência (5g)',
      ultra: 'Metal escovado com acabamento nobre (18g)',
    },
    {
      feature: 'Cashback e Crescimento',
      roxo: 'Nu Limite Garantido vinculado ao RDB',
      ultra: '1% de cashback instantâneo que rende 200% do CDI e nunca expira',
    },
    {
      feature: 'Tag de Pedágio e Estacionamento',
      roxo: 'Disponível via parceiros',
      ultra: 'NuTag inclusa com zero mensalidade e débito automático na conta',
    },
    {
      feature: 'Espaço Família',
      roxo: 'Conta e cartões individuais',
      ultra: 'Compartilhe benefícios, saldo e NuTags com até 4 pessoas',
    },
    {
      feature: 'Salas VIP e Viagens',
      roxo: 'Mastercard Surpreenda e assistência global',
      ultra: 'Acesso ilimitado ao VIP Lounge Black em Guarulhos e seguros de viagem',
    },
    {
      feature: 'Cartão Virtual',
      roxo: 'Virtual recorrente e temporário de 24h',
      ultra: 'Virtual recorrente e temporário de 24h com proteção avançada',
    },
    {
      feature: 'Atendimento',
      roxo: 'Suporte humano 24/7 no chat do app',
      ultra: 'Equipe Ultravioleta dedicada com prioridade máxima',
    },
  ],
}

export const TRACK = {
  title: ['Acompanhe tudo do seu jeito.', 'Em tempo real.'],
  lead: 'No app você vê saldo, fatura e Caixinhas sem esperar fechamentos ou extratos. Controle absoluto na palma da mão.',
  items: [
    'Saldo e rendimento diário a 100% do CDI atualizados na hora',
    'Pix no Crédito com parcelamento em até 12x transparente',
    'Fatura do cartão detalhada por categorias inteligentes',
    'Modo Rua: proteção automática com limite seguro fora de casa',
  ],
  action: 'Abrir conta digital',
  categories: [
    { id: 'todas', label: 'Todas as despesas', total: 'R$ 1.842,50', pct: 100 },
    { id: 'alimentacao', label: 'Alimentação & Mercado', total: 'R$ 720,30', pct: 39 },
    { id: 'transporte', label: 'Transporte & Combustível', total: 'R$ 380,00', pct: 21 },
    { id: 'assinaturas', label: 'Assinaturas & Streaming', total: 'R$ 142,20', pct: 8 },
    { id: 'viagem', label: 'Viagem & Lazer', total: 'R$ 600,00', pct: 32 },
  ],
}

export const EASY = {
  title: 'É fácil de usar!',
  lead: 'Abra sua conta digital e peça o cartão sem sair do celular. Do cadastro biométrico ao primeiro uso no Pix, tudo acontece no app.',
  items: [
    { icon: 'bank', title: 'Conta que rende 100% CDI', text: 'Seu dinheiro rende automaticamente todos os dias úteis após 30 dias.' },
    { icon: 'card', title: 'Cartão de crédito sem anuidade', text: 'Peça pelo app, crie cartões virtuais e acompanhe gastos em tempo real.' },
    { icon: 'pix', title: 'Pix e Pix no Crédito', text: 'Faça transferências gratuitas 24/7 ou parcele compras no cartão sem usar saldo.' },
    { icon: 'lock', title: 'Modo Rua & Proteção', text: 'Defina limites de transferência quando estiver desconectado de redes Wi-Fi confiáveis.' },
  ],
}

export const STEPS = [
  { title: '1. Cadastro 100% digital', text: 'Baixe o app, informe seus dados básicos e envie uma selfie de confirmação em menos de 3 minutos.' },
  { title: '2. Cartão virtual imediato', text: 'Com a aprovação, seu cartão virtual fica pronto para compras online antes mesmo do cartão físico chegar.' },
  { title: '3. Controle e rendimento', text: 'Acompanhe faturas, crie Caixinhas para suas metas e ative o Modo Rua para segurança nas ruas.' },
]

export const APP = {
  title: ['Baixe o app e tenha', 'uma experiência completa.'],
  lead: 'Conta digital, cartão de crédito, investimentos e segurança de última geração no mesmo aplicativo sem agências ou burocracia.',
  stores: [
    { name: 'App Store', small: 'Baixar na' },
    { name: 'Google Play', small: 'Disponível no' },
  ],
  note: 'Disponível para iOS e Android com avaliação 4.8★ de mais de 90 milhões de clientes.',
  chips: [
    { title: 'Completo', text: 'Conta, cartões, Caixinhas e Pix num só lugar.' },
    { title: 'Sem papelada', text: 'Abertura de conta e aprovação 100% digitais.' },
    { title: 'Inteligente', text: 'Gastos categorizados e limites ajustáveis a qualquer hora.' },
    { title: 'Modo Rua', text: 'Segurança reforçada para transferências fora de casa.' },
  ],
}

export const BENEFITS = {
  title: ['Tudo o que você precisa.', 'Sem tarifas abusivas.'],
  lead: 'Conta que rende, cartão sem anuidade, Pix no Crédito e atendimento humano eleito o melhor do Brasil.',
  items: [
    { icon: 'card', title: 'Zero anuidade de verdade', text: 'Peça pelo app e use o roxinho sem taxa de manutenção ou anuidade surpresa.' },
    { icon: 'bank', title: 'Conta digital 100% do CDI', text: 'Rendimento superior à poupança com garantia do FGC até R$ 250 mil.' },
    { icon: 'pix', title: 'Pix no Crédito em até 12x', text: 'Transfira dinheiro na hora mesmo sem saldo em conta, parcelando na fatura.' },
    { icon: 'lock', title: 'Modo Rua inteligente', text: 'Limite automático de transferências fora de suas redes Wi-Fi seguras.' },
    { icon: 'phone', title: 'Cartão Virtual 24h', text: 'Gere um cartão temporário para compras únicas na internet que se autodestrói.' },
    { icon: 'chat', title: 'Atendimento humanizado 24/7', text: 'Converse com especialistas via chat a qualquer hora sem robôs repetitivos.' },
  ],
}

export const FAQ = [
  {
    q: 'Qual é a diferença entre o Cartão Nubank (Roxo) e o Nubank Ultravioleta?',
    a: 'O Cartão Nubank (Roxo) possui bandeira Mastercard Gold ou Platinum, é 100% livre de anuidade e oferece controle completo no app com Nu Limite Garantido. Já o Nubank Ultravioleta é o cartão Mastercard Black em metal pesado (18g), com 1% de cashback instantâneo que rende 200% do CDI, NuTag sem mensalidade para pedágios, acesso ilimitado à Sala VIP Lounge em Guarulhos e Espaço Família compartilhado.',
  },
  {
    q: 'Como funciona o rendimento de 100% do CDI da conta e das Caixinhas?',
    a: 'O dinheiro que fica na conta digital rende 100% do CDI em todos os dias úteis após o 30º dia de depósito, com rendimento retroativo sobre todo o período. Já nas Caixinhas do Nubank, o dinheiro rende 100% do CDI desde o primeiro dia útil através de RDB com garantia do Fundo Garantidor de Créditos (FGC) até R$ 250 mil por CPF.',
  },
  {
    q: 'O que é o Modo Rua e como ele me protege fora de casa?',
    a: 'O Modo Rua é um recurso pioneiro de segurança do Nubank. Você define redes Wi-Fi confiáveis (como da sua casa e do trabalho) e estabelece um limite máximo para transferências Pix, TED e pagamentos de boletos fora dessas redes. Se seu celular for furtado ou acessado na rua, transações acima do valor seguro exigem reconhecimento facial.',
  },
  {
    q: 'Como funciona o Pix no Crédito?',
    a: 'Com o Pix no Crédito, você pode fazer pagamentos e transferências via Pix instantaneamente usando o limite do seu cartão de crédito Nubank. Você pode parcelar o valor em até 12 vezes com taxas transparentes exibidas antes da confirmação, enquanto quem recebe tem o valor integral creditado na hora.',
  },
  {
    q: 'O que é o Cartão Virtual Temporário de 24 horas?',
    a: 'É um cartão virtual criado exclusivamente para compras pontuais em sites ou aplicativos novos e desconhecidos. Ele possui número e CVV próprios e expira automaticamente após 24 horas da geração, garantindo que suas informações não fiquem salvas para cobranças indevidas futuras.',
  },
  {
    q: 'Este site é um canal oficial do Nubank?',
    a: 'Não. Este projeto é uma demonstração independente de engenharia de software desenvolvida para fins de estudo técnico, otimização de performance WebGL e portfólio. Não possui vínculo comercial ou institucional com o Nubank (Nu Pagamentos S.A. / Nu Financeira S.A.).',
  },
]

export const MARQUEE = {
  title: 'O que cabe no app',
  items: [
    'Conta digital 100% CDI',
    'Cartão de crédito sem anuidade',
    'Ultravioleta em metal',
    'Pix no Crédito em 12x',
    'Caixinhas RDB',
    'Modo Rua inteligente',
    'Cartão virtual 24h',
    'NuTag sem mensalidade',
    'Espaço Família',
    'Atendimento 24/7',
  ],
}

export const FOOTER = {
  columns: [
    { title: 'Produtos', links: ['Conta digital 100% CDI', 'Cartão de crédito Roxo', 'Nubank Ultravioleta', 'Caixinhas do Nubank', 'Pix no Crédito'] },
    { title: 'Segurança', links: ['Modo Rua', 'Cartão Virtual 24h', 'Nu Limite Garantido', 'Central de Proteção'] },
    { title: 'Institucional', links: ['Projeto de Portfólio', 'Arquitetura WebGL', 'Auditoria de Performance', 'Código Aberto'] },
  ],
  disclaimer: 'Demonstração interativa de produto fintech desenvolvida para fins de estudo de engenharia de software e portfólio. Não possui vínculo institucional ou comercial com o Nubank (Nu Pagamentos S.A. / Nu Financeira S.A.). Todas as marcas, logotipos e produtos são de titularidade de seus respectivos proprietários.',
  legal: 'Nomes, marcas e referências visuais pertencem aos seus respectivos titulares. Dados, valores e limites exibidos nesta interface são meramente ilustrativos e não constituem oferta financeira real.',
}
