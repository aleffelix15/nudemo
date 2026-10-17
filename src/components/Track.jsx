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

  const handleCatKeyDown = (e, i) => {
    let nextIndex = null
    if (e.key === 'ArrowRight') {
      nextIndex = (i + 1) % CATEGORIES.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (i - 1 + CATEGORIES.length) % CATEGORIES.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = CATEGORIES.length - 1
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

  return (
    <section className="track" id="conta" ref={ref} aria-label="Acompanhe sua conta Nubank">
      {/* Cabeçalho da seção: renderizado no topo em mobile e alinhado à direita no desktop */}
      <div className="track-head">
        <h2>
          {TRACK.title[0]}
          <br />
          <span className="accent">{TRACK.title[1]}</span>
        </h2>
        <p className="lead">{TRACK.lead}</p>
      </div>

      {/* Dispositivo com rastro interativo perfeitamente enquadrado */}
      <div className="track-device">
        <m.div className="track-phone" style={reduced ? { rotate: -2 } : { rotate, y: lift }}>
          <Trail progress={scrollYProgress} reduced={reduced} mobile={mobile} />
          <Phone
            activeTab={activeCat === 2 ? 'cartao' : activeCat === 3 ? 'caixinhas' : 'conta'}
            onTabChange={(tab) => {
              if (tab === 'cartao') setActiveCat(2)
              else if (tab === 'caixinhas') setActiveCat(3)
              else setActiveCat(0)
            }}
            alt="Tela inicial do aplicativo Nubank em Modo Escuro"
          />
        </m.div>
      </div>

      {/* Bloco de estatísticas, categorias e benefícios */}
      <div className="track-body">
        {/* Barra de progresso e estatísticas em tempo real com números tabulares */}
        <div className="track-stat-card" role="region" aria-label="Controle financeiro em tempo real">
          <div className="track-stat-row">
            <div>
              <span className="track-stat-sub">Saldo disponível na conta</span>
              <div className="track-stat-val tabular-nums">R$ 1.518,38</div>
            </div>
            <span className="track-stat-badge">Ao vivo</span>
          </div>
          <div className="track-progress-bar" aria-hidden="true">
            <div className="track-progress-fill" style={{ width: '65%' }} />
          </div>
          <div className="track-stat-grid">
            <div className="track-stat-cell">
              <span>Fatura do cartão</span>
              <b className="tabular-nums">R$ 16,44</b>
            </div>
            <div className="track-stat-cell">
              <span>Limite disponível</span>
              <b className="tabular-nums">R$ 983,56</b>
            </div>
          </div>
        </div>

        {/* Filtros e botões de categoria com touch targets mínimos de 44x44px */}
        <div className="track-categories" role="tablist" aria-label="Categorias de controle">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
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
              {cat}
            </button>
          ))}
        </div>
        <span className="sr-only" aria-live="polite">
          Categoria selecionada: {CATEGORIES[activeCat]}
        </span>

        <ul className="ticks" role="list">
          {TRACK.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <button
          type="button"
          className="btn btn-primary track-cta"
          onClick={() => demo('Abrir conta', 'Demonstração de abertura de conta digital.')}
        >
          {TRACK.action}
        </button>
      </div>
    </section>
  )
}
