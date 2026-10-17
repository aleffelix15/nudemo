import { useEffect, useState } from 'react'
import { TEX_W, TEX_H, HOLDER_NAME } from '../three/cardConsts'
import { useFontsReady } from '../three/hooks'
import { NuLogo, MastercardLogo, EmvChipSvg, ContactlessWaveSvg } from './Icons'

// Cartão de alta resolução gerado via canvas usado pelo TiltCard
export function useCardImage(variant = 0, width = 560) {
  const ready = useFontsReady()
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    let createdUrl = null

    const h = Math.round(width * (TEX_H / TEX_W))

    const run = () => {
      import('../three/cardArt').then(({ drawFront }) => {
        if (cancelled) return
        const c = drawFront(variant, { rounded: true, W: width, H: h })
        if (c.toBlob) {
          c.toBlob((blob) => {
            if (cancelled || !blob) return
            createdUrl = URL.createObjectURL(blob)
            setSrc(createdUrl)
          }, 'image/png')
        } else {
          setSrc(c.toDataURL('image/png'))
        }
      })
    }

    const id =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(run, { timeout: 2000 })
        : setTimeout(run, 200)

    return () => {
      cancelled = true
      if (typeof cancelIdleCallback === 'function' && typeof id === 'number') {
        cancelIdleCallback(id)
      } else {
        clearTimeout(id)
      }
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl)
      }
    }
  }, [ready, variant, width])

  return src
}

// Cartão Nubank 2D em CSS/SVG puro (fiel à referência física oficial e à cena 3D)
export function SvgNuCard({
  variant = 'roxinho',
  name = HOLDER_NAME,
  className = '',
}) {
  const variantClass = variant === 1 || variant === 'ultravioleta' ? 'ultravioleta' : 'roxinho'
  return (
    <div className={`nu-card-2d ${variantClass} ${className}`} role="img" aria-label={`Cartão Nubank ${name}`}>
      <div className="nu-card-2d-sheen" aria-hidden="true" />
      <div className="nu-card-2d-top">
        <div className="nu-card-2d-top-badge">
          <MastercardLogo size={36} />
          <ContactlessWaveSvg size={18} color="rgba(255, 255, 255, 0.85)" />
        </div>
        <div className="nu-card-2d-chip">
          <EmvChipSvg width={42} />
        </div>
      </div>
      <div className="nu-card-2d-middle">
        <span className="nu-card-2d-name">{name}</span>
      </div>
      <div className="nu-card-2d-bottom">
        <NuLogo size={38} color="#ffffff" />
      </div>
    </div>
  )
}

export default function CardFallback() {
  return (
    <div className="card-fallback" role="img" aria-label="Cartão de crédito Nubank">
      <div className="card-fallback-glow" aria-hidden="true" />
      <div className="card-fallback-frame">
        <SvgNuCard />
      </div>
    </div>
  )
}
