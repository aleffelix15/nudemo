import Icon from './Icons'

// Chassis de alta precisão em titânio escuro (#1E1E24) e interface autêntica do Nubank em Dark Mode
export default function Phone({
  screen = 'dark', // 'dark' | 'ecosystem'
  className = '',
  alt = 'Interface do aplicativo Nubank',
}) {
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

      {/* Container interno da tela (border-radius: 28px, fundo preto absoluto) */}
      <div className="phone-screen-viewport">
        {screen === 'ecosystem' ? (
          <div className="phone-eco-frame">
            <img
              src="/assets/app-light-and-card-ref.jpg"
              alt={alt}
              className="phone-eco-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="nu-app-native" aria-label="Tela inicial do aplicativo Nubank em Modo Escuro">
            {/* Barra de Status */}
            <div className="nu-status-bar" aria-hidden="true">
              <span className="nu-status-time">00:15</span>
              <div className="nu-status-icons">
                <span className="nu-status-4g">4G</span>
                <span className="nu-status-battery" />
              </div>
            </div>

            {/* Cabeçalho Roxo Autêntico */}
            <div className="nu-app-header">
              <div className="nu-user-profile">
                <div className="nu-avatar-circle" aria-label="Perfil do usuário">
                  <Icon name="user" size={17} />
                </div>
              </div>
              <div className="nu-header-actions" aria-hidden="true">
                <button type="button" className="nu-icon-btn" aria-label="Ocultar saldo">
                  <Icon name="eye" size={19} />
                </button>
                <button type="button" className="nu-icon-btn" aria-label="Ajuda">
                  <span className="nu-help-mark">?</span>
                </button>
                <button type="button" className="nu-icon-btn" aria-label="Mensagens">
                  <Icon name="chat" size={18} />
                </button>
              </div>
            </div>

            {/* Conteúdo rolável do app */}
            <div className="nu-app-scroll">
              {/* Seção de Conta */}
              <div className="nu-block nu-block-account">
                <div className="nu-block-head">
                  <span>Conta</span>
                  <Icon name="chevron" size={14} className="nu-chevron" />
                </div>
                <div className="nu-balance-val tabular-nums">R$ 1.518,38</div>
              </div>

              {/* Atalhos Rápidos */}
              <div className="nu-shortcuts-row">
                <div className="nu-shortcut">
                  <div className="nu-shortcut-circle">
                    <Icon name="pix" size={20} />
                  </div>
                  <span>Área Pix</span>
                </div>
                <div className="nu-shortcut">
                  <div className="nu-shortcut-circle">
                    <Icon name="barcode" size={20} />
                  </div>
                  <span>Pagar</span>
                </div>
                <div className="nu-shortcut has-badge">
                  <div className="nu-badge-pill">R$50.000</div>
                  <div className="nu-shortcut-circle">
                    <Icon name="loan" size={20} />
                  </div>
                  <span>Pegar emprestado</span>
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

              {/* Meus Cartões */}
              <div className="nu-card-pill-btn">
                <Icon name="card" size={18} />
                <span>Meus cartões</span>
              </div>

              {/* Card de Notificação Promocional */}
              <div className="nu-promo-card">
                <p>
                  <b>Pix no Crédito:</b> transfira sem usar o saldo da conta.
                </p>
              </div>

              {/* Cartão de Crédito */}
              <div className="nu-block nu-block-card">
                <div className="nu-block-head">
                  <span>Cartão de crédito</span>
                  <Icon name="chevron" size={14} className="nu-chevron" />
                </div>
                <span className="nu-sublabel">Fatura atual</span>
                <div className="nu-invoice-val tabular-nums">R$ 16,44</div>
                <span className="nu-limit-note tabular-nums">Limite disponível de R$ 983,56</span>
              </div>

              {/* Empréstimo */}
              <div className="nu-block nu-block-loan">
                <div className="nu-block-head">
                  <span>Empréstimo</span>
                  <Icon name="chevron" size={14} className="nu-chevron" />
                </div>
                <span className="nu-sublabel">Valor disponível de até</span>
                <div className="nu-loan-val tabular-nums">R$ 50.000,00</div>
              </div>
            </div>

            {/* Barra de Navegação Inferior Flutuante */}
            <div className="nu-bottom-nav" aria-hidden="true">
              <div className="nu-bottom-pill">
                <span className="nu-nav-active">
                  <Icon name="transfer" size={16} />
                </span>
                <span className="nu-nav-item">$</span>
                <span className="nu-nav-item">
                  <Icon name="card" size={16} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
