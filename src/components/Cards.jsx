import { lazy, Suspense, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CARDS } from '../content'
import { useCardImage } from './CardFallback'
import { useDemo } from '../lib/demo'
import {
  useReducedMotionMQ,
  useIsCoarsePointer,
  useIsMobile,
  useFontsReady,
  hasWebGL,
  useCanvasVisibility,
  useNearViewport,
} from '../three/hooks'

const StackScene = lazy(() => import('../three/StackScene'))

// Cartão com perspectiva CSS vertical que responde suavemente ao ponteiro
function TiltCard({ variant, name }) {
  const src = useCardImage(variant, 520)
  const ref = useRef(null)
  const rectRef = useRef(null)
  const reduced = useReducedMotionMQ()
  const isCoarse = useIsCoarsePointer()

  const enter = () => {
    if (reduced || isCoarse || !ref.current) return
    rectRef.current = ref.current.getBoundingClientRect()
  }

  const move = (e) => {
    if (reduced || isCoarse || !ref.current) return
    let r = rectRef.current
    if (!r) {
      r = ref.current.getBoundingClientRect()
      rectRef.current = r
    }
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    // Rotação sutil limitada a no máximo ±8°
    ref.current.style.setProperty('--ry', `${-8 + x * 14}deg`)
    ref.current.style.setProperty('--rx', `${6 - y * 12}deg`)
  }

  const leave = () => {
    rectRef.current = null
    ref.current?.style.removeProperty('--ry')
    ref.current?.style.removeProperty('--rx')
  }

  return (
    <div
      className="tilt"
      style={{ touchAction: 'pan-y' }}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="tilt-card" ref={ref}>
        {src ? (
          <img
            src={src}
            alt={`Cartão físico ${name}`}
            width="320"
            height="507"
            className="tilt-img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="tilt-ph" />
        )}
        <span className="tilt-shadow" aria-hidden="true" />
      </div>
    </div>
  )
}

export default function Cards() {
  const demo = useDemo()
  const mobile = useIsMobile()
  const reduced = useReducedMotionMQ()
  const fonts = useFontsReady()
  const [gl] = useState(() => hasWebGL())
  const stageRef = useRef(null)
  const isNear = useNearViewport(stageRef, '350px')
  const isVisible = useCanvasVisibility(stageRef, '250px 0px')
  const progress = useRef(0.48)

  return (
    <section className="cards" id="cartoes" ref={stageRef}>
      <div className="head">
        <h2>{CARDS.title}</h2>
        <p>{CARDS.lead}</p>
      </div>

      {mobile && isNear && gl && fonts && (
        <div className="cards-mobile-stage" aria-hidden="true">
          <Suspense fallback={null}>
            <StackScene
              progress={progress}
              running={isVisible}
              reduced={reduced}
              mobile={true}
            />
          </Suspense>
        </div>
      )}

      <ul className="cards-grid">
        {CARDS.items.map((c, i) => (
          <motion.li
            key={c.name}
            className="card-col"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard variant={c.variant} name={c.name} />
            <h3>{c.name}</h3>
            <p>{c.text}</p>
            <ul className="points">
              {c.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => demo(`${CARDS.action}: ${c.name}`, 'Este é um site demonstrativo. Nenhum cartão é solicitado.')}
            >
              {CARDS.action}
            </button>
          </motion.li>
        ))}
      </ul>
      <div className="cards-help">
        <p>
          <b>{CARDS.helpTitle}</b> {CARDS.helpText}
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => demo('Comparar cartões', 'A comparação detalhada não existe neste site demonstrativo.')}
        >
          {CARDS.helpAction}
        </button>
      </div>
    </section>
  )
}
