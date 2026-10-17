import { useState, useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { TRACK } from '../content'
import Phone from './Phone'
import { useDemo } from '../lib/demo'
import { useReducedMotionMQ, useIsMobile } from '../three/hooks'

const GHOSTS = 7
const CATEGORIES = ['Tudo no app', 'Saldo & Pix', 'Cartão & Limite', 'Empréstimos']

// Camadas atrás do celular: abrem conforme a seção cruza a tela
function Trail({ progress, reduced, mobile }) {
  const spread = useTransform(progress, [0.05, 0.55], [0.15, 1])
  const count = mobile ? 5 : GHOSTS
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Ghost key={i} i={i + 1} spread={spread} reduced={reduced} mobile={mobile} />
      ))}
    </>
  )
}

function Ghost({ i, spread, reduced, mobile }) {
  const factor = mobile ? 5 : 15
  const yFactor = mobile ? 5 : 11
  const x = useTransform(spread, (s) => -i * factor * (reduced ? 1 : s))
  const y = useTransform(spread, (s) => i * yFactor * (reduced ? 1 : s))
  return <m.span className="ghost" style={{ x, y, opacity: 0.42 - i * 0.05 }} aria-hidden="true" />
}

export default function Track() {
  const demo = useDemo()
  const ref = useRef(null)
  const reduced = useReducedMotionMQ()
  const mobile = useIsMobile()
  const [activeCat, setActiveCat] = useState(0)
  const [caixinhasBalance, setCaixinhasBalance] = useState(5240)
  const [justSaved, setJustSaved] = useState(false)
  const savedTimer = useRef(null)

  const categories = TRACK.categories || [
    { id: 'todas', label: 'Todas as despesas', total: 'R$ 1.842,50', pct: 100 },
    { id: 'alimentacao', label: 'Alimentação', total: 'R$ 720,30', pct: 39 },
    { id: 'transporte', label: 'Transporte', total: 'R$ 380,00', pct: 21 },
    { id: 'assinaturas', label: 'Assinaturas', total: 'R$ 142,20', pct: 8 },
    { id: 'viagem', label: 'Viagem', total: 'R$ 600,00', pct: 32 },
  ]

  const handleSaveMoney = () => {
    setCaixinhasBalance((b) => b + 100)
    setJustSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setJustSaved(false), 2400)
  }

  const handleCatKeyDown = (e, i) => {
    let nextIndex = null
    if (e.key === 'ArrowRight') {
      nextIndex = (i + 1) % categories.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (i - 1 + categories.length) % categories.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = categories.length - 1
    }
    if (nextIndex !== null) {
      e.preventDefault()
      setActiveCat(nextIndex)
      document.getElementById(`track-tab-${nextIndex}`)?.focus()
    }
  }

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [mobile ? 2 : 6, mobile ? -3 : -8])
  const lift = useTransform(scrollYProgress, [0, 1], [mobile ? 10 : 30, mobile ? -10 : -30])

  const currentCat = categories[activeCat] || categories[0]

  return (
    <section className="track" id="conta" ref={ref} aria-label="Acompanhe sua conta Nubank">
      {/* Cabeçalho da seção */}
      <div className="track-head">
        <h2>
          {TRACK.title[0]}
          <br />
          <span className="accent">{TRACK.title[1]}</span>
        </h2>
        <p className="lead">{TRACK.lead}</p>
      </div>

      {/* Dispositivo com rastro interativo */}
      <div className="track-device">
        <m.div className="track-phone" style={reduced ? { rotate: -2 } : { rotate, y: lift }}>
          <Trail progress={scrollYProgress} reduced={reduced} mobile={mobile} />
          <Phone
            activeTab={activeCat === 0 ? 'conta' : activeCat === 3 ? 'cartao' : 'caixinhas'}
            onTabChange={(tab) => {
              if (tab === 'cartao') setActiveCat(3)
              else if (tab === 'caixinhas') setActiveCat(4)
              else setActiveCat(0)
            }}
            caixinhasBalance={caixinhasBalance}
            alt="Tela inicial do aplicativo Nubank em Modo Escuro"
          />
        </m.div>
      </div>

      {/* Bloco de estatísticas, categorias e simulador de Caixinhas */}
      <div className="track-body">
        {/* Barra de progresso e estatísticas em tempo real com números tabulares */}
        <div className="track-stat-card" role="region" aria-label="Controle financeiro em tempo real">
          <div className="track-stat-row">
            <div>
              <span className="track-stat-sub">{currentCat.label}</span>
              <div className="track-stat-val tabular-nums">{currentCat.total}</div>
            </div>
            <span className="track-stat-badge">Simulador</span>
          </div>
          <div className="track-progress-bar" aria-hidden="true">
            <m.div
              className="track-progress-fill"
              animate={{ width: `${currentCat.pct}%` }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="track-stat-grid">
            <div className="track-stat-cell">
              <span>Fatura estimada</span>
              <b className="tabular-nums">R$ 1.842,50</b>
            </div>
            <div className="track-stat-cell">
              <span>Proporção do mês</span>
              <b className="tabular-nums">{currentCat.pct}%</b>
            </div>
          </div>
        </div>

        {/* Filtros e botões de categoria com touch targets mínimos de 44x44px */}
        <div className="track-categories" role="tablist" aria-label="Categorias de despesas">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              id={`track-tab-${i}`}
              type="button"
              role="tab"
              tabIndex={activeCat === i ? 0 : -1}
              aria-selected={activeCat === i}
              aria-controls="track-tabpanel"
              className={`track-cat-btn ${activeCat === i ? 'is-active' : ''}`}
              onClick={() => setActiveCat(i)}
              onKeyDown={(e) => handleCatKeyDown(e, i)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span className="sr-only" aria-live="polite">
          Categoria selecionada: {currentCat.label}
        </span>

        {/* Demonstração interativa das Caixinhas do Nubank */}
        <div className="track-caixinhas-box" role="region" aria-label="Demonstração interativa das Caixinhas">
          <div className="track-caixinhas-row">
            <div>
              <span className="track-caixinhas-title">Caixinhas Nubank (100% do CDI)</span>
              <div className="track-caixinhas-val tabular-nums">
                R$ {caixinhasBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm track-save-btn"
              onClick={handleSaveMoney}
              title="Guardar mais R$ 100 de demonstração"
            >
              + Guardar R$ 100 (Demo)
            </button>
          </div>
          {justSaved && (
            <div className="track-saved-toast" role="status">
              ✓ +R$ 100 adicionado à Reserva de Emergência!
            </div>
          )}
        </div>

        <ul className="ticks" role="list">
          {TRACK.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <button
          type="button"
          className="btn btn-primary track-cta"
          onClick={() => demo('Abrir conta digital', 'Demonstração de abertura de conta digital com rendimento de 100% do CDI.')}
        >
          {TRACK.action}
        </button>
      </div>
    </section>
  )
}
