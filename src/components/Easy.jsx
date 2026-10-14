import { lazy, Suspense, useRef } from 'react'
import { EASY } from '../content'
import Icon from './Icons'
import CardFallback from './CardFallback'
import SceneBoundary from './SceneBoundary'
import {
  hasWebGL,
  useCanvasVisibility,
  useIsMobile,
  useReducedMotionMQ,
  useFontsReady,
  useSectionScrollProgress,
  useNearViewport,
} from '../three/hooks'

const StackScene = lazy(() => import('../three/StackScene'))

export default function Easy() {
  const ref = useRef(null)
  const isNear = useNearViewport(ref, '350px')
  const isVisible = useCanvasVisibility(ref, '250px 0px')
  const mobile = useIsMobile()
  const reduced = useReducedMotionMQ()
  const fonts = useFontsReady()
  const gl = hasWebGL()
  const progress = useSectionScrollProgress(ref)

  return (
    <section className="easy" id="facilidades" ref={ref} aria-label="Facilidades do Nubank">
      <div className="easy-stage" aria-hidden="true">
        {gl && fonts && isNear ? (
          <SceneBoundary fallback={<CardFallback />}>
            <Suspense fallback={<CardFallback />}>
              <StackScene
                progress={progress}
                running={isVisible}
                reduced={reduced}
                mobile={mobile}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          <CardFallback />
        )}
      </div>
      <div className="easy-copy">
        <h2>{EASY.title}</h2>
        <p>{EASY.lead}</p>
      </div>
      <ul className="easy-grid" role="list">
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
