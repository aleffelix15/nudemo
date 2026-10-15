import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HERO } from '../content'
import { useDemo } from '../lib/demo'
import { hasWebGL, useCanvasVisibility, useIsMobile, useReducedMotionMQ } from '../three/hooks'
import CardFallback from './CardFallback'
import SceneBoundary from './SceneBoundary'

const HeroScene = lazy(() => import('../three/HeroScene'))

const line = {
  hidden: { y: '105%' },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] } }),
}

export default function Hero() {
  const demo = useDemo()
  const stage = useRef(null)
  const isVisible = useCanvasVisibility(stage, '250px 0px')
  const mobile = useIsMobile()
  const reduced = useReducedMotionMQ()
  const [gl] = useState(() => hasWebGL())
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const showFallback = !gl

  return (
    <section className="hero" id="topo" aria-label="Apresentação do Nubank">
      <div className="hero-copy">
        <motion.div
          className="hero-badge"
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          role="note"
        >
          Conceito de redesign independente. Sem vínculo com o Nubank. Dados fictícios.
        </motion.div>
        <h1 className="hero-title" aria-label={HERO.title.join(' ')}>
          {HERO.title.map((t, i) => (
            <span className="mask" key={t} aria-hidden="true">
              <motion.span
                className={`mask-in ${i === 1 ? 'is-accent' : ''}`}
                variants={line}
                custom={i}
                initial={reduced ? 'show' : 'hidden'}
                animate="show"
              >
                {t}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero-lead"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          {HERO.lead}
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="btn btn-primary"
            aria-label="Abrir conta digital no Nubank"
            onClick={() => demo('Abrir conta', 'Demonstração de abertura de conta digital.')}
          >
            {HERO.primary}
          </button>
          <a className="btn btn-ghost" href="#app" aria-label="Conhecer o aplicativo do Nubank">
            {HERO.secondary}
          </a>
        </motion.div>

        <motion.ul
          className="hero-notes"
          aria-label="Destaques do serviço"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {HERO.notes.map((n) => (
            <li key={n.title}>
              <b>{n.title}</b>
              <span>{n.text}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <div className={`hero-stage ${ready ? 'is-ready' : ''}`} ref={stage}>
        {gl ? (
          <SceneBoundary fallback={<CardFallback />}>
            <Suspense fallback={null}>
              <HeroScene
                reduced={reduced}
                interactive={!mobile}
                running={isVisible}
                onReady={onReady}
              />
            </Suspense>
          </SceneBoundary>
        ) : null}
        {showFallback ? <CardFallback /> : null}
      </div>
    </section>
  )
}
