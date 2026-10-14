import { useEffect, useState } from 'react'
import { drawFront, TEX_W, TEX_H } from '../three/cardArt'
import { useFontsReady } from '../three/hooks'

// Cartão de alta resolução gerado via canvas usado enquanto o 3D carrega ou quando não há WebGL
export function useCardImage(variant = 0, width = 560) {
  const ready = useFontsReady()
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!ready) return
    const h = Math.round(width * (TEX_H / TEX_W))
    const c = drawFront(variant, { rounded: true, W: width, H: h })
    setSrc(c.toDataURL('image/png'))
  }, [ready, variant, width])

  return src
}

export default function CardFallback() {
  const src = useCardImage(0, 600)
  return (
    <div className="card-fallback" role="img" aria-label="Cartão de crédito Nubank">
      <div className="card-fallback-glow" aria-hidden="true" />
      <div className="card-fallback-frame">
        {src ? (
          <img
            src={src}
            alt="Cartão físico Nubank demonstrativo"
            width="360"
            height="571"
            className="fallback-card-img"
            decoding="async"
          />
        ) : (
          <div className="editorial-eco-card">
            <div className="editorial-img-frame">
              <img
                src="/assets/app-light-and-card-ref.jpg"
                alt="Cartão e Aplicativo Nubank"
                width="447"
                height="447"
                className="editorial-eco-img"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
