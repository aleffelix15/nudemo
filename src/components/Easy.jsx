import { lazy, Suspense, useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { EASY } from '../content'
import Icon from './Icons'
import { hasWebGL, useInView, useIsMobile, useReducedMotionMQ, useFontsReady } from '../three/hooks'

const StackScene = lazy(() => import('../three/StackScene'))

export default function Easy() {
  const ref = useRef(null)
  const progress = useRef(0)
  const inView = useInView(ref, '200px')
  const mobile = useIsMobile()
  const reduced = useReducedMotionMQ()
  const fonts = useFontsReady()
  const gl = hasWebGL()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => (progress.current = v))
  if (reduced) progress.current = 0.6

  return (
    <section className="easy" ref={ref}>
      <div className="easy-stage" aria-hidden="true">
        {gl && fonts && (
          <Suspense fallback={null}>
            <StackScene progress={progress} running={inView} reduced={reduced} mobile={mobile} />
          </Suspense>
        )}
      </div>
      <div className="easy-copy">
        <h2>{EASY.title}</h2>
        <p>{EASY.lead}</p>
      </div>
      <ul className="easy-grid">
        {EASY.items.map((it) => (
          <li key={it.title}>
            <Icon name={it.icon} size={22} />
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
