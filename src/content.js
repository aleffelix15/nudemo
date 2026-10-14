// Todo o texto da página fica aqui. Valores e nomes são demonstrativos.

export const NAV = [
  { id: 'conta', label: 'Conta' },
  { id: 'cartoes', label: 'Cartões' },
  { id: 'app', label: 'App' },
  { id: 'vantagens', label: 'Vantagens' },
]

export const HERO = {
  title: ['Simples, rápido', 'e sem anuidade.'],
  lead: 'Conta digital e cartão de crédito no mesmo app. Sem fila, sem papel e sem ir a uma agência.',
  primary: 'Abrir conta',
  secondary: 'Ver como funciona',
  notes: [
    { title: 'Seguro', text: 'Bloqueie o cartão pelo app, a qualquer hora.' },
    { title: 'Prático', text: 'Fatura, saldo e Pix na mesma tela.' },
  ],
}

export const CARDS = {
  title: 'Escolha o cartão ideal para você',
  lead: 'Do dia a dia ao acabamento em metal, cada cartão tem o seu lugar.',
  items: [
    {
      variant: 0,
      name: 'Nubank',
      text: 'O cartão de crédito sem anuidade, pedido e controlado pelo app.',
      points: ['Sem anuidade', 'Bloqueio pelo app', 'Fatura em tempo real'],
    },
    {
      variant: 1,
      name: 'Ultravioleta',
      text: 'Acabamento em metal escovado para quem quer mais do cartão.',
      points: ['Corpo em metal', 'Atendimento prioritário', 'Benefícios exclusivos'],
    },
  ],
  action: 'Solicitar cartão',
  helpTitle: 'Ainda em dúvida?',
  helpText: 'Compare os benefícios dos dois cartões.',
  helpAction: 'Comparar cartões',
}

export const TRACK = {
  title: ['Acompanhe tudo do seu jeito.', 'De onde estiver.'],
  lead: 'No app você vê saldo, fatura e gastos sem esperar o extrato chegar.',
  items: [
    'Saldo e gastos atualizados na hora',
    'Pix e pagamentos em poucos toques',
    'Fatura do cartão sempre à vista',
    'Bloqueio do cartão em segundos',
  ],
  action: 'Abrir conta',
}

export const EASY = {
  title: 'É fácil!',
  lead: 'Abra sua conta digital e peça o cartão sem sair do celular. Do cadastro ao primeiro uso, tudo acontece no app.',
  items: [
    { icon: 'bank', title: 'Conta digital', text: 'Guarde, receba e pague sem tarifa de manutenção.' },
    { icon: 'card', title: 'Cartão de crédito', text: 'Peça pelo app e acompanhe a fatura em tempo real.' },
    { icon: 'pix', title: 'Pix', text: 'Envie e receba a qualquer hora, inclusive no fim de semana.' },
    { icon: 'lock', title: 'Segurança', text: 'Bloqueie o cartão e veja alertas de compra no app.' },
  ],
}

export const STEPS = [
  { title: 'Comece pelo app', text: 'Faça o cadastro com alguns toques e acompanhe a análise do pedido.' },
  { title: 'Peça o que precisa', text: 'Cartão, transferências e pagamentos ficam a um toque de distância.' },
  { title: 'Tenha o controle', text: 'Veja gastos, fatura e limite sem sair da tela inicial.' },
]

export const APP = {
  title: ['Baixe o app e tenha', 'um banco completo no bolso.'],
  lead: 'Abra a conta, peça o cartão e acompanhe tudo pelo celular. Sem precisar ir a uma agência.',
  stores: [
    { name: 'App Store', small: 'Baixar na' },
    { name: 'Google Play', small: 'Disponível no' },
  ],
  note: 'Disponível para iOS e Android.',
  chips: [
    { title: 'Completo', text: 'Conta, cartão e Pix num só lugar.' },
    { title: 'Sem papelada', text: 'Abertura de conta 100% digital.' },
    { title: 'Inteligente', text: 'Gastos organizados por categoria.' },
    { title: 'Seguro', text: 'Bloqueio do cartão na hora.' },
  ],
}

export const BENEFITS = {
  title: ['Tudo o que você precisa.', 'Sem complicação.'],
  lead: 'Conta, cartão e Pix no mesmo app, com atendimento sem sair dele.',
  items: [
    { icon: 'card', title: 'Cartão sem anuidade', text: 'Peça pelo app e use sem pagar para ter o cartão.' },
    { icon: 'bank', title: 'Conta sem mensalidade', text: 'Guarde e movimente seu dinheiro sem tarifa mensal.' },
    { icon: 'pix', title: 'Pix a qualquer hora', text: 'Pague e receba de dia, de noite e no fim de semana.' },
    { icon: 'lock', title: 'Bloqueio imediato', text: 'Perdeu o cartão? Bloqueie em segundos pelo app.' },
    { icon: 'phone', title: 'Tudo no celular', text: 'Fatura, limite e extrato sempre à mão.' },
    { icon: 'chat', title: 'Atendimento no app', text: 'Tire dúvidas por chat, sem ligar para ninguém.' },
  ],
}

export const MARQUEE = {
  title: 'O que cabe no app',
  items: ['Conta digital', 'Cartão de crédito', 'Pix', 'Boleto', 'Transferência', 'Cartão virtual', 'Fatura', 'Atendimento por chat'],
}

export const FOOTER = {
  columns: [
    { title: 'Produtos', links: ['Conta digital', 'Cartão de crédito', 'Cartão Ultravioleta', 'Pix'] },
    { title: 'Ajuda', links: ['Central de ajuda', 'Segurança', 'Fale com a gente'] },
    { title: 'Institucional', links: ['Sobre', 'Privacidade', 'Termos de uso'] },
  ],
  disclaimer: 'Projeto demonstrativo independente, sem vínculo oficial com o Nubank.',
  legal: 'Nomes, marcas e referências visuais pertencem aos seus respectivos titulares.',
}
