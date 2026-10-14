import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TRACK } from '../content'
import Phone from './Phone'
import { useDemo } from '../lib/demo'
import { useReducedMotionMQ, useIsMobile } from '../three/hooks'

const GHOSTS = 7
const CATEGORIES = ['Tudo no app', 'Saldo & Pix', 'Cartão & Limite', 'Empréstimos']

// Camadas atrás do celular: abrem conforme a seção cruza a tela (efeito de eco da referência)
function Trail({ progress, reduced, mobile }) {
  const spread = useTransform(progress, [0.05, 0.55], [0.15, 1])
  return (
    <>
      {Array.from({ length: GHOSTS }, (_, i) => (
        <Ghost key={i} i={i + 1} spread={spread} reduced={reduced} mobile={mobile} />
      ))}
    </>
  )
}
function Ghost({ i, spread, reduced, mobile }) {
  const factor = mobile ? 8 : 15
  const yFactor = mobile ? 7 : 11
  const x = useTransform(spread, (s) => -i * factor * (reduced ? 1 : s))
  const y = useTransform(spread, (s) => i * yFactor * (reduced ? 1 : s))
  return <motion.span className="ghost" style={{ x, y, opacity: 0.42 - i * 0.05 }} aria-hidden="true" />
}

export default function Track() {
  const demo = useDemo()
  const ref = useRef(null)
  const reduced = useReducedMotionMQ()
  const mobile = useIsMobile()
  const [activeCat, setActiveCat] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [mobile ? 3 : 6, mobile ? -4 : -8])
  const lift = useTransform(scrollYProgress, [0, 1], [mobile ? 15 : 30, mobile ? -15 : -30])

  return (
    <section className="track" id="conta" ref={ref}>
      <div className="track-device">
        <motion.div className="track-phone" style={reduced ? { rotate: -2 } : { rotate, y: lift }}>
          <Trail progress={scrollYProgress} reduced={reduced} mobile={mobile} />
          <Phone screen="dark" dark alt="Tela inicial do aplicativo Nubank em Modo Escuro" />
        </motion.div>
      </div>
      <div className="track-copy">
        <h2>
          {TRACK.title[0]}
          <br />
          <span className="accent">{TRACK.title[1]}</span>
        </h2>
        <p className="lead">{TRACK.lead}</p>

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
              type="button"
              role="tab"
              aria-selected={activeCat === i}
              className={`track-cat-btn ${activeCat === i ? 'is-active' : ''}`}
              onClick={() => {
                setActiveCat(i)
                demo(`Categoria: ${cat}`, `Visualizando funcionalidades da categoria ${cat}.`)
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="ticks">
          {TRACK.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => demo('Abrir conta', 'Demonstração de abertura de conta digital.')}
        >
          {TRACK.action}
        </button>
      </div>
    </section>
  )
}
