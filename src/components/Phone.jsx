import { useState, useRef, useEffect } from 'react'
import Icon from './Icons'

// Chassis de alta precisão em titânio escuro (#1E1E24) e interface nativa 100% vetorial do Nubank em Dark Mode
export default function Phone({
  activeTab = 'conta', // 'conta' | 'cartao' | 'caixinhas'
  onTabChange,
  className = '',
  alt = 'Interface do aplicativo Nubank',
  caixinhasBalance = 5240,
}) {
  const [showBalance, setShowBalance] = useState(true)
  const [copiedPix, setCopiedPix] = useState(false)
  const [modoRuaActive, setModoRuaActive] = useState(false)
  const [showVirtualCard, setShowVirtualCard] = useState(false)
  const pixTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (pixTimerRef.current) clearTimeout(pixTimerRef.current)
    }
  }, [])

  const toggleBalance = () => setShowBalance((s) => !s)

  const handlePixClick = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText('chave.demo@exemplo.com')
      }
    } catch {
      // Ignora erro de permissão caso negado pelo navegador
    }
    setCopiedPix(true)
    if (pixTimerRef.current) clearTimeout(pixTimerRef.current)
    pixTimerRef.current = setTimeout(() => setCopiedPix(false), 2200)
  }

  return (
    <div className={`phone-chassis ${className}`} role="region" aria-label={alt}>
      {/* Moldura externa em titânio com chanfro reflexivo e botões laterais */}
      <div className="phone-button phone-button-volume-up" aria-hidden="true" />
      <div className="phone-button phone-button-volume-down" aria-hidden="true" />
      <div className="phone-button phone-button-power" aria-hidden="true" />

      {/* Dynamic Island / Ilha superior */}
      <div className="phone-island" aria-hidden="true">
        <span className="phone-camera-lens" />
      </div>

      {/* Viewport da tela interna (fundo preto absoluto #000000, 100% vetorial) */}
      <div className="phone-screen-viewport">
        <div className="nu-app-native" aria-label="Aplicativo Nubank Modo Escuro">
          {/* Barra de Status */}
          <div className="nu-status-bar" aria-hidden="true">
            <span className="nu-status-time">00:15</span>
            <div className="nu-status-icons">
              <span className="nu-status-4g">4G</span>
              <div className="nu-status-battery" />
            </div>
          </div>

          {/* Cabeçalho Roxo Autêntico (#530082) */}
          <div className="nu-app-header">
            <div className="nu-user-profile">
              <div className="nu-avatar-circle" aria-label="Perfil de Gabriela">
                <Icon name="user" size={17} />
              </div>
              <span className="nu-greeting">Olá, Gabriela</span>
            </div>
            <div className="nu-header-actions">
              <button
                type="button"
                className="nu-icon-btn"
                aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
                onClick={toggleBalance}
                title={showBalance ? 'Ocultar valores' : 'Mostrar valores'}
              >
                <Icon name={showBalance ? 'eye' : 'eyeClosed'} size={19} />
              </button>
              <button type="button" className="nu-icon-btn" aria-label="Ajuda">
                <span className="nu-help-mark">?</span>
              </button>
              <button type="button" className="nu-icon-btn" aria-label="Mensagens">
                <Icon name="chat" size={18} />
              </button>
            </div>
          </div>

          {/* Banner interativo de Modo Rua */}
          <div className="nu-modorua-bar">
            <button
              type="button"
              className={`nu-modorua-btn ${modoRuaActive ? 'is-active' : ''}`}
              onClick={() => setModoRuaActive((m) => !m)}
              aria-pressed={modoRuaActive}
              title="Alternar proteção do Modo Rua"
            >
              <div className="nu-modorua-icon">
                <Icon name="shield" size={13} />
              </div>
              <div className="nu-modorua-info">
                <span>{modoRuaActive ? 'Modo Rua Ativo (Limite R$ 500)' : 'Modo Rua: Toque para ativar'}</span>
              </div>
              <span className="nu-modorua-switch" aria-hidden="true" />
            </button>
          </div>

          {/* Conteúdo rolável do app */}
          <div className="nu-app-scroll">
            {activeTab === 'conta' && (
              <>
                {/* Bloco Conta (fundo #09090C) */}
                <div className="nu-block nu-block-account">
                  <div className="nu-block-head">
                    <span>Conta digital</span>
                    <Icon name="chevron" size={14} className="nu-chevron" />
                  </div>
                  <div className="nu-balance-val tabular-nums">
                    {showBalance ? 'R$ 1.518,38' : '••••••••'}
                  </div>
                  <span className="nu-cdi-tag">Rendimento automático 100% do CDI</span>
                </div>

                {/* Carrossel de Ações Rápidas (círculos #18181E, 48px) */}
                <div className="nu-shortcuts-row">
                  <button
                    type="button"
                    className="nu-shortcut"
                    onClick={handlePixClick}
                    aria-label="Área Pix"
                  >
                    <div className="nu-shortcut-circle">
                      <Icon name="pix" size={20} />
                    </div>
                    <span>{copiedPix ? 'Copiado!' : 'Área Pix'}</span>
                  </button>
                  <div className="nu-shortcut">
                    <div className="nu-shortcut-circle">
                      <Icon name="barcode" size={20} />
                    </div>
                    <span>Pagar</span>
                  </div>
                  <div className="nu-shortcut has-badge">
                    <div className="nu-badge-pill">R$ 50.000</div>
                    <div className="nu-shortcut-circle">
                      <Icon name="loan" size={20} />
                    </div>
                    <span>Empréstimo</span>
                  </div>
                  <div className="nu-shortcut">
                    <div className="nu-shortcut-circle">
                      <Icon name="transfer" size={18} />
                    </div>
                    <span>Transferir</span>
                  </div>
                  <div className="nu-shortcut">
                    <div className="nu-shortcut-circle">
                      <Icon name="phone" size={18} />
                    </div>
                    <span>Recarga</span>
                  </div>
                </div>

                {/* Card Meus Cartões */}
                <div
                  className="nu-card-pill-btn"
                  role="button"
                  tabIndex={0}
                  onClick={() => onTabChange?.('cartao')}
                  onKeyDown={(e) => e.key === 'Enter' && onTabChange?.('cartao')}
                >
                  <Icon name="card" size={18} />
                  <span>Meus cartões (Físico & Virtual 24h)</span>
                </div>

                {/* Card de Destaque */}
                <div className="nu-promo-card">
                  <p>
                    <b className="nu-accent-purple">Pix no Crédito:</b> parcele em até 12x no cartão sem usar seu saldo.
                  </p>
                </div>

                {/* Bloco Cartão de Crédito */}
                <div className="nu-block nu-block-card">
                  <div className="nu-block-head">
                    <span>Cartão de crédito</span>
                    <Icon name="chevron" size={14} className="nu-chevron" />
                  </div>
                  <span className="nu-sublabel">Fatura atual</span>
                  <div className="nu-invoice-val tabular-nums">
                    {showBalance ? 'R$ 16,44' : '••••••••'}
                  </div>
                  <span className="nu-limit-note tabular-nums">Limite disponível de R$ 983,56</span>
                </div>

                {/* Bloco Empréstimo */}
                <div className="nu-block nu-block-loan">
                  <div className="nu-block-head">
                    <span>Empréstimo</span>
                    <Icon name="chevron" size={14} className="nu-chevron" />
                  </div>
                  <span className="nu-sublabel">Valor disponível de até</span>
                  <div className="nu-loan-val tabular-nums">
                    {showBalance ? 'R$ 50.000,00' : '••••••••'}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'cartao' && (
              <>
                {/* Visualização Detalhada de Cartão de Crédito */}
                <div className="nu-block nu-block-card is-expanded">
                  <div className="nu-block-head">
                    <span>Cartão de crédito</span>
                    <Icon name="chevron" size={14} className="nu-chevron" />
                  </div>
                  <span className="nu-sublabel">Fatura atual fecha em 7 dias</span>
                  <div className="nu-invoice-val tabular-nums is-large">
                    {showBalance ? 'R$ 16,44' : '••••••••'}
                  </div>
                  <div className="nu-limit-bar-wrap">
                    <div className="nu-limit-bar">
                      <div className="nu-limit-fill" style={{ width: '4%' }} />
                    </div>
                    <div className="nu-limit-details">
                      <span>Limite disponível: <b>{showBalance ? 'R$ 983,56' : '••••'}</b></span>
                      <span>Total: R$ 1.000,00</span>
                    </div>
                  </div>
                </div>

                {/* Cartão Virtual Temporário 24h em Popover/Card */}
                {showVirtualCard && (
                  <div className="nu-virtual-card-popover" role="region" aria-label="Cartão virtual temporário">
                    <div className="nu-virtual-top">
                      <span className="nu-virtual-badge">Temporário 24h</span>
                      <button
                        type="button"
                        className="nu-virtual-close"
                        aria-label="Fechar cartão virtual"
                        onClick={() => setShowVirtualCard(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="nu-virtual-number">•••• •••• •••• 4821</div>
                    <div className="nu-virtual-row">
                      <span>Validade: <b>23h 59m</b></span>
                      <span>CVV: <b>{showBalance ? '382' : '•••'}</b></span>
                    </div>
                    <small className="nu-virtual-note">Exclusão automática em 24h para compras seguras</small>
                  </div>
                )}

                {/* Ações do Cartão */}
                <div className="nu-actions-grid">
                  <div className="nu-action-tile">
                    <Icon name="barcode" size={18} />
                    <span>Pagar fatura</span>
                  </div>
                  <button
                    type="button"
                    className="nu-action-tile is-btn"
                    onClick={() => setShowVirtualCard((v) => !v)}
                  >
                    <Icon name="card" size={18} />
                    <span>{showVirtualCard ? 'Ocultar virtual' : 'Virtual 24h'}</span>
                  </button>
                  <div className="nu-action-tile">
                    <Icon name="lock" size={18} />
                    <span>Bloquear</span>
                  </div>
                  <div className="nu-action-tile">
                    <Icon name="shield" size={18} />
                    <span>Ajustar limite</span>
                  </div>
                </div>

                {/* Últimas Compras */}
                <div className="nu-transactions-box">
                  <span className="nu-sublabel-head">Últimas transações</span>
                  <div className="nu-tx-row">
                    <div className="nu-tx-info">
                      <b>Supermercado Pão de Mel</b>
                      <small>Hoje, 14:22 • Cartão físico</small>
                    </div>
                    <span className="nu-tx-price tabular-nums">{showBalance ? 'R$ 12,50' : '••••'}</span>
                  </div>
                  <div className="nu-tx-row">
                    <div className="nu-tx-info">
                      <b>Padaria Central</b>
                      <small>Ontem, 08:45 • Por aproximação</small>
                    </div>
                    <span className="nu-tx-price tabular-nums">{showBalance ? 'R$ 3,94' : '••••'}</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'caixinhas' && (
              <>
                {/* Visualização de Caixinhas & Limite */}
                <div className="nu-block nu-block-account">
                  <div className="nu-block-head">
                    <span>Caixinhas Nubank</span>
                    <Icon name="chevron" size={14} className="nu-chevron" />
                  </div>
                  <span className="nu-sublabel">Total guardado rendendo 100% do CDI</span>
                  <div className="nu-balance-val tabular-nums">
                    {showBalance ? `R$ ${Number(caixinhasBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                  </div>
                  <span className="nu-cdi-badge">+R$ 48,20 de rendimento este mês</span>
                </div>

                {/* Lista de Caixinhas */}
                <div className="nu-boxes-list">
                  <div className="nu-box-card">
                    <div className="nu-box-head">
                      <div className="nu-box-icon">
                        <Icon name="box" size={18} />
                      </div>
                      <div className="nu-box-info">
                        <b>Reserva de Emergência</b>
                        <small>RDB Resgate Imediato • 100% do CDI</small>
                      </div>
                    </div>
                    <div className="nu-box-val tabular-nums">
                      {showBalance ? `R$ ${Number(Math.max(0, caixinhasBalance - 1740)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                    </div>
                  </div>

                  <div className="nu-box-card">
                    <div className="nu-box-head">
                      <div className="nu-box-icon">
                        <Icon name="box" size={18} />
                      </div>
                      <div className="nu-box-info">
                        <b>Viagem de Férias</b>
                        <small>Meta: 70% atingida</small>
                      </div>
                    </div>
                    <div className="nu-box-val tabular-nums">
                      {showBalance ? 'R$ 1.740,00' : '••••••••'}
                    </div>
                  </div>

                  <button type="button" className="nu-btn-new-box">
                    <Icon name="plus" size={16} />
                    <span>Criar nova Caixinha</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Barra de Navegação Inferior Flutuante */}
          <div className="nu-bottom-nav" role="navigation" aria-label="Navegação rápida do app">
            <div className="nu-bottom-pill">
              <button
                type="button"
                className={`nu-nav-btn ${activeTab === 'conta' ? 'is-active' : ''}`}
                onClick={() => onTabChange?.('conta')}
                aria-label="Início e transações"
              >
                <Icon name="transfer" size={16} />
              </button>
              <button
                type="button"
                className={`nu-nav-btn ${activeTab === 'caixinhas' ? 'is-active' : ''}`}
                onClick={() => onTabChange?.('caixinhas')}
                aria-label="Planejamento e Caixinhas"
              >
                $
              </button>
              <button
                type="button"
                className={`nu-nav-btn ${activeTab === 'cartao' ? 'is-active' : ''}`}
                onClick={() => onTabChange?.('cartao')}
                aria-label="Cartões e Shopping"
              >
                <Icon name="bag" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
