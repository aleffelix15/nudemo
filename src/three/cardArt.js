import * as THREE from 'three'
import { CARD } from './cardGeometry'
import { getQualityTier, isMobileDevice } from './quality.js'

// Resolução de alta fidelidade para texturas PBR (proporção vertical 1 : 1.5858)
export const TEX_W = 1024
export const TEX_H = 1624

// Logotipo oficial Nubank extraído com máscara alfa e transparência exata
const NU_LOGO_DATA_URI = 'data:image/png;base64,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'

let nuImg = null
function getNuImage() {
  if (!nuImg && typeof Image !== 'undefined') {
    nuImg = new Image()
    nuImg.src = NU_LOGO_DATA_URI
  }
  return nuImg
}
if (typeof Image !== 'undefined') {
  getNuImage()
}

// Cache global (singleton) de telas e texturas geradas proceduralmente
const canvasCache = {
  front: new Map(),
  back: new Map(),
  chip: null,
  bump: new Map(),
}
const textureCache = new Map()

// Paleta calibrada para corresponder rigorosamente ao alvo #820AD1 (130, 10, 209) sob iluminação de estúdio
export const VARIANTS = [
  {
    id: 'roxo',
    name: 'Nubank',
    // Tom calibrado para ACES/AgX atingir exatamente #820AD1 (130, 10, 209)
    base: ['#9215e4', '#790ec6'],
    base2d: ['#820ad1', '#6d07b4'],
    ink: '#ffffff',
    inkSoft: 'rgba(255, 255, 255, 0.94)',
    edge: '#65069f',
    metal: false,
  },
  {
    id: 'ultravioleta',
    name: 'Ultravioleta',
    base: ['#1d1824', '#110d16'],
    base2d: ['#241e2d', '#130e18'],
    ink: '#f4f1f8',
    inkSoft: 'rgba(244, 241, 248, 0.85)',
    edge: '#1e1826',
    metal: true,
  },
]

const FONT = '"Figtree Variable", "Figtree", system-ui, -apple-system, sans-serif'

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function roundedPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Titular fictício padronizado do projeto
export const HOLDER_NAME = 'Marina A C Costa'

// Marcador neutro da bandeira de pagamento (dois círculos sobrepostos em violeta claro e magenta translúcidos)
export function drawPaymentBadge(ctx, x, y, r = 44) {
  const d = r * 1.18
  const x1 = x
  const x2 = x + d

  ctx.save()
  // Círculo Violeta Claro Translúcido
  ctx.fillStyle = 'rgba(216, 180, 254, 0.78)'
  ctx.beginPath()
  ctx.arc(x1, y, r, 0, Math.PI * 2)
  ctx.fill()

  // Círculo Magenta Translúcido
  ctx.fillStyle = 'rgba(244, 114, 182, 0.70)'
  ctx.beginPath()
  ctx.arc(x2, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
export const drawMastercard = drawPaymentBadge

import { NU_SVG_PATH } from '../components/Icons'

const nuPath = typeof Path2D !== 'undefined' ? new Path2D(NU_SVG_PATH) : null

// Desenha o logotipo oficial com fita contínua e proporção exata
export function drawNuLogo(ctx, x, y, targetWidth = 145, opacity = 1) {
  const img = getNuImage()
  const aspect = 313 / 169
  const targetHeight = targetWidth / aspect

  ctx.save()
  ctx.globalAlpha = opacity
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, targetWidth, targetHeight)
  } else if (nuPath) {
    const scale = targetWidth / 24
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.fillStyle = '#ffffff'
    ctx.fill(nuPath)
  }
  ctx.restore()
}

// Textura da face frontal (fiel à referência física app-light-and-card-ref.jpg)
export function drawFront(variant = 0, { rounded = false, W, H } = {}) {
  const tier = getQualityTier()
  const defaultW = tier === 'low' ? 768 : TEX_W
  const defaultH = tier === 'low' ? 1218 : TEX_H
  const targetW = W || defaultW
  const targetH = H || defaultH
  const cacheKey = `${variant}_${rounded}_${targetW}_${targetH}`
  if (canvasCache.front.has(cacheKey)) {
    return canvasCache.front.get(cacheKey)
  }

  const v = VARIANTS[variant]
  const c = canvas(targetW, targetH)
  const ctx = c.getContext('2d')
  const scale = targetW / TEX_W
  ctx.scale(scale, scale)

  const w = TEX_W
  const h = TEX_H

  if (rounded) {
    roundedPath(ctx, 0, 0, w, h, (CARD.radius / CARD.w) * w)
    ctx.clip()
  }

  // Fundo com acabamento acetinado
  const pal = rounded && v.base2d ? v.base2d : v.base
  const g = ctx.createLinearGradient(0, 0, w * 0.95, h)
  g.addColorStop(0, pal[0])
  g.addColorStop(1, pal[1])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Variação de luz direcional suave
  const rg = ctx.createRadialGradient(w * 0.35, h * 0.25, 0, w * 0.4, h * 0.4, w * 0.85)
  rg.addColorStop(0, v.metal ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.09)')
  rg.addColorStop(0.5, 'rgba(255,255,255,0.02)')
  rg.addColorStop(1, 'rgba(0,0,0,0.15)')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, w, h)

  // 1. Topo Esquerdo: Bandeira Mastercard
  drawMastercard(ctx, 160, 185, 46)

  // 2. Topo Direito: Rebaixo e Chip EMV metálico ouro/champagne
  const chipX = 720
  const chipY = 135
  const chipW = 146
  const chipH = 112

  // Rebaixo sutil onde entra o chip
  ctx.save()
  ctx.strokeStyle = v.metal ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.22)'
  ctx.lineWidth = 3
  roundedPath(ctx, chipX - 2, chipY - 2, chipW + 4, chipH + 4, 18)
  ctx.stroke()
  ctx.restore()

  if (rounded) {
    // Na renderização 2D (fallback), desenha o chip metálico diretamente
    ctx.save()
    roundedPath(ctx, chipX, chipY, chipW, chipH, 16)
    ctx.clip()
    ctx.drawImage(drawChip(), chipX, chipY, chipW, chipH)
    ctx.restore()
  }

  // 3. Centro-Esquerdo (abaixo da metade): Nome demonstrativo Gabriela Lima com relevo discreto
  ctx.save()
  ctx.font = `600 44px ${FONT}`
  ctx.letterSpacing = '1.2px'
  // Sombra leve de gravação/relevo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
  ctx.fillText(HOLDER_NAME, 132, 942)
  // Texto principal
  ctx.fillStyle = v.inkSoft
  ctx.fillText(HOLDER_NAME, 130, 940)
  ctx.restore()

  // 4. Canto Inferior Esquerdo: Logotipo oficial "nu"
  drawNuLogo(ctx, 130, 1370, 150, 0.98)

  canvasCache.front.set(cacheKey, c)
  return c
}

// Textura do verso vertical do cartão
export function drawBack(variant = 0, { W, H } = {}) {
  const tier = getQualityTier()
  const defaultW = tier === 'low' ? 768 : TEX_W
  const defaultH = tier === 'low' ? 1218 : TEX_H
  const targetW = W || defaultW
  const targetH = H || defaultH
  const cacheKey = `${variant}_${targetW}_${targetH}`
  if (canvasCache.back.has(cacheKey)) {
    return canvasCache.back.get(cacheKey)
  }

  const v = VARIANTS[variant]
  const c = canvas(targetW, targetH)
  const ctx = c.getContext('2d')
  const scale = targetW / TEX_W
  ctx.scale(scale, scale)

  const w = TEX_W
  const h = TEX_H

  // Fundo
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, v.base[1])
  g.addColorStop(1, v.base[0])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Tarja magnética superior
  ctx.fillStyle = '#0a080e'
  ctx.fillRect(0, h * 0.08, w, h * 0.12)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fillRect(0, h * 0.08, w, 2)

  // Faixa de assinatura branca / metálica
  ctx.fillStyle = v.metal ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)'
  roundedPath(ctx, 120, h * 0.32, w * 0.65, h * 0.08, 12)
  ctx.fill()

  // CVV demonstrativo
  ctx.font = `italic 600 36px ${FONT}`
  ctx.fillStyle = '#1c1527'
  ctx.fillText('890', w * 0.81, h * 0.375)

  // Mensagens legais de demonstração
  ctx.fillStyle = v.inkSoft
  ctx.font = `500 32px ${FONT}`
  ctx.fillText(HOLDER_NAME, 120, h * 0.52)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
  ctx.font = `450 26px ${FONT}`
  ctx.fillText('Cartão de demonstração independente.', 120, h * 0.62)
  ctx.fillText('Não possui valor monetário real.', 120, h * 0.65)

  // Logotipo oficial no verso
  drawNuLogo(ctx, w - 240, h * 0.86, 120, 0.75)

  canvasCache.back.set(cacheKey, c)
  return c
}

// Chip EMV metálico ouro/champagne com contatos elétricos gravados (fiel à foto)
export function drawChip() {
  if (canvasCache.chip) {
    return canvasCache.chip
  }

  const isMobile = isMobileDevice()
  const W = isMobile ? 256 : 512
  const H = isMobile ? 196 : 392
  const c = canvas(W, H)
  const ctx = c.getContext('2d')
  const scale = W / 512
  ctx.scale(scale, scale)

  const origW = 512
  const origH = 392

  // Gradiente metálico ouro/champagne conforme referência real
  const g = ctx.createLinearGradient(0, 0, origW, origH)
  g.addColorStop(0, '#f7e7ba')
  g.addColorStop(0.28, '#e0c47a')
  g.addColorStop(0.65, '#cba54d')
  g.addColorStop(1, '#a67d28')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, origW, origH)

  // Linhas gravadas dos contatos do chip
  ctx.strokeStyle = 'rgba(55, 42, 22, 0.68)'
  ctx.lineWidth = 5.5
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(0, origH * 0.32)
  ctx.lineTo(origW * 0.28, origH * 0.32)
  ctx.lineTo(origW * 0.28, origH * 0.18)

  ctx.moveTo(0, origH * 0.68)
  ctx.lineTo(origW * 0.28, origH * 0.68)
  ctx.lineTo(origW * 0.28, origH * 0.82)

  ctx.moveTo(origW, origH * 0.32)
  ctx.lineTo(origW * 0.72, origH * 0.32)
  ctx.lineTo(origW * 0.72, origH * 0.18)

  ctx.moveTo(origW, origH * 0.68)
  ctx.lineTo(origW * 0.72, origH * 0.68)
  ctx.lineTo(origW * 0.72, origH * 0.82)

  ctx.moveTo(origW * 0.28, origH * 0.18)
  ctx.lineTo(origW * 0.28, 0)

  ctx.moveTo(origW * 0.72, origH * 0.18)
  ctx.lineTo(origW * 0.72, 0)

  ctx.moveTo(origW * 0.28, origH * 0.82)
  ctx.lineTo(origW * 0.28, origH)

  ctx.moveTo(origW * 0.72, origH * 0.82)
  ctx.lineTo(origW * 0.72, origH)
  ctx.stroke()

  // Ilha central do chip
  roundedPath(ctx, origW * 0.28, origH * 0.18, origW * 0.44, origH * 0.64, 28)
  ctx.stroke()

  canvasCache.chip = c
  return c
}

export function drawBump(metal) {
  const isMobile = isMobileDevice()
  const key = `${!!metal}_${isMobile}`
  if (canvasCache.bump.has(key)) {
    return canvasCache.bump.get(key)
  }

  const size = isMobile ? 64 : 256
  const c = canvas(size, size)
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  if (!isMobile) {
    if (metal) {
      for (let i = 0; i < 400; i++) {
        const v = 100 + Math.random() * 60
        ctx.fillStyle = `rgba(${v},${v},${v},0.4)`
        ctx.fillRect(0, Math.random() * size, size, 1)
      }
    } else {
      // Micro-textura acetinada leve
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * size
        const y = Math.random() * size
        const s = Math.random() * 2
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
        ctx.fillRect(x, y, s, s)
      }
    }
  }
  canvasCache.bump.set(key, c)
  return c
}

export function tex(canvasEl, { srgb = true, aniso = 16, repeat } = {}) {
  const isMobile = isMobileDevice()
  const targetAniso = isMobile ? 2 : Math.min(16, aniso)
  const repKey = repeat ? `${repeat[0]}_${repeat[1]}` : 'none'
  if (!canvasEl._texUid) {
    canvasEl._texUid = 'tex_' + Math.random().toString(36).substring(2, 9)
  }
  const cacheKey = `${canvasEl._texUid}_${srgb}_${targetAniso}_${repKey}`

  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)
  }

  const t = new THREE.CanvasTexture(canvasEl)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = targetAniso
  t.generateMipmaps = !isMobile
  t.minFilter = isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
  }
  textureCache.set(cacheKey, t)
  return t
}
