import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
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
  const [canMountScene, setCanMountScene] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!gl) return

    let cancelled = false
    let handle = null

    const activate = () => {
      if (cancelled) return
      requestAnimationFrame(() => {
        if (!cancelled) setCanMountScene(true)
      })
    }

    // Carregamento diferido real: permite que HTML, CSS, fontes e FCP renderizem
    // instantaneamente antes de iniciar o Three.js e a compilação WebGL
    if (typeof requestIdleCallback === 'function') {
      handle = requestIdleCallback(activate, { timeout: 1200 })
    } else {
      handle = setTimeout(activate, 300)
    }

    const onUserAction = () => {
      activate()
    }
    window.addEventListener('scroll', onUserAction, { passive: true, once: true })
    window.addEventListener('pointerdown', onUserAction, { passive: true, once: true })

    return () => {
      cancelled = true
      if (typeof cancelIdleCallback === 'function' && typeof handle === 'number') {
        cancelIdleCallback(handle)
      } else {
        clearTimeout(handle)
      }
      window.removeEventListener('scroll', onUserAction)
      window.removeEventListener('pointerdown', onUserAction)
    }
  }, [gl])

  return (
    <section className="hero" id="topo" aria-label="Apresentação do Nubank">
      <div className="hero-copy">
        <m.div
          className="hero-badge"
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          role="note"
        >
          Demonstração independente de engenharia de software e portfólio.
        </m.div>
        <h1 className="hero-title" aria-label={HERO.title.join(' ')}>
          {HERO.title.map((t, i) => (
            <span className="mask" key={t} aria-hidden="true">
              <m.span
                className={`mask-in ${i === 1 ? 'is-accent' : ''}`}
                variants={line}
                custom={i}
                initial={reduced ? 'show' : 'hidden'}
                animate="show"
              >
                {t}
              </m.span>
            </span>
          ))}
        </h1>

        <m.p
          className="hero-lead"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          {HERO.lead}
        </m.p>

        <m.div
          className="hero-cta"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="btn btn-primary"
            aria-label="Abrir conta digital (Demonstração)"
            onClick={() => demo('Abrir conta digital', 'Demonstração de abertura de conta digital com rendimento de 100% do CDI.')}
          >
            {HERO.primary}
          </button>
          <a className="btn btn-ghost" href="#app" aria-label="Conhecer o aplicativo do Nubank">
            {HERO.secondary}
          </a>
        </m.div>

        <m.ul
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
        </m.ul>
      </div>

      <div className={`hero-stage ${ready ? 'is-ready' : ''}`} ref={stage}>
        {/* Placeholder premium do cartão: visível de imediato no first paint sem espera de WebGL */}
        <CardFallback />

        {/* Cena 3D: carregamento e montagem estritamente diferidos pós-FCP */}
        {gl && canMountScene ? (
          <SceneBoundary fallback={null}>
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
      </div>
    </section>
  )
}
