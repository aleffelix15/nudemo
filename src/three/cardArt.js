import * as THREE from 'three'
import { CARD } from './cardGeometry'
import { NU_SVG_PATH } from '../components/Icons'

// Resolução de alta fidelidade para texturas PBR (proporção vertical 1 : 1.5858)
export const TEX_W = 1024
export const TEX_H = 1624

// Cores e acabamento extraídos diretamente de images (1).jpg e images.png
export const VARIANTS = [
  {
    id: 'roxo',
    name: 'Nubank',
    // Roxo profundo e sofisticado com sutil variação tonal metálica
    base: ['#6a0dad', '#540280'],
    base2d: ['#720eb9', '#5b038c'],
    ink: '#ffffff',
    inkSoft: 'rgba(255, 255, 255, 0.88)',
    edge: '#530082',
    metal: false,
  },
  {
    id: 'ultravioleta',
    name: 'Ultravioleta',
    base: ['#231d2b', '#120f17'],
    base2d: ['#2c2436', '#17131e'],
    ink: '#f4f1f8',
    inkSoft: 'rgba(244, 241, 248, 0.82)',
    edge: '#2d2737',
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

function noiseTile(size, alpha) {
  const c = canvas(size, size)
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = alpha * 255
  }
  ctx.putImageData(img, 0, 0)
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

// Logotipo Mastercard oficial (vermelho, amarelo-laranja e lente de interseção laranja)
export function drawMastercard(ctx, x, y, r = 44) {
  const d = r * 1.22
  const x1 = x
  const x2 = x + d

  // Círculo Vermelho
  ctx.save()
  ctx.fillStyle = '#EB001B'
  ctx.beginPath()
  ctx.arc(x1, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Círculo Amarelo-Alaranjado
  ctx.save()
  ctx.fillStyle = '#F79E1B'
  ctx.beginPath()
  ctx.arc(x2, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Interseção Laranja
  ctx.save()
  ctx.beginPath()
  ctx.arc(x1, y, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = '#FF5F00'
  ctx.beginPath()
  ctx.arc(x2, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Logotipo "nu" vetorial reproduzindo com exatidão a fita contínua
export function drawNuVector(ctx, x, y, targetWidth = 140, color = 'rgba(255,255,255,0.95)') {
  ctx.save()
  const p = new Path2D(NU_SVG_PATH)
  const scale = targetWidth / 24
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.fillStyle = color
  ctx.fill(p)
  ctx.restore()
}

// Textura da face frontal (fiel à referência física images (1).jpg)
export function drawFront(variant = 0, { rounded = false, W = TEX_W, H = TEX_H } = {}) {
  const v = VARIANTS[variant]
  const c = canvas(W, H)
  const ctx = c.getContext('2d')
  const scale = W / TEX_W
  ctx.scale(scale, scale)

  const w = TEX_W
  const h = TEX_H

  if (rounded) {
    roundedPath(ctx, 0, 0, w, h, (CARD.radius / CARD.w) * w)
    ctx.clip()
  }

  // Fundo com acabamento acetinado / metálico sutil
  const pal = rounded && v.base2d ? v.base2d : v.base
  const g = ctx.createLinearGradient(0, 0, w * 0.9, h)
  g.addColorStop(0, pal[0])
  g.addColorStop(1, pal[1])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Variação de luz direcional suave de estúdio
  const rg = ctx.createRadialGradient(w * 0.35, h * 0.25, 0, w * 0.4, h * 0.4, w * 0.85)
  rg.addColorStop(0, v.metal ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.11)')
  rg.addColorStop(0.5, 'rgba(255,255,255,0.03)')
  rg.addColorStop(1, 'rgba(0,0,0,0.16)')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, w, h)

  if (v.metal) {
    // Efeito de escovado horizontal para Ultravioleta
    ctx.globalAlpha = 0.45
    for (let i = 0; i < 1100; i++) {
      const yLine = Math.random() * h
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.15)'
      ctx.fillRect(0, yLine, w, 1 + Math.random() * 1.5)
    }
    ctx.globalAlpha = 1
  }

  // 1. Topo Esquerdo: Bandeira Mastercard
  drawMastercard(ctx, 160, 185, 46)

  // 2. Topo Centro-Direita: Rebaixo e Chip EMV metálico prateado
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
    // Na renderização 2D (fallback), estampa o chip metálico diretamente na imagem
    ctx.save()
    roundedPath(ctx, chipX, chipY, chipW, chipH, 16)
    ctx.clip()
    ctx.drawImage(drawChip(), chipX, chipY, chipW, chipH)
    ctx.restore()
  }

  // 3. Centro-Esquerdo (abaixo da metade): Nome demonstrativo Gabriela Lima
  ctx.save()
  ctx.font = `600 46px ${FONT}`
  ctx.letterSpacing = '1.2px'
  // Sombra leve de gravação
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)'
  ctx.fillText('Gabriela Lima', 132, 942)
  // Texto principal prateado-branco
  ctx.fillStyle = v.inkSoft
  ctx.fillText('Gabriela Lima', 130, 940)
  ctx.restore()

  // 4. Canto Inferior Esquerdo: Logotipo oficial "nu"
  drawNuVector(ctx, 130, 1370, 150, v.ink)

  return c
}

// Textura do verso vertical do cartão
export function drawBack(variant = 0) {
  const v = VARIANTS[variant]
  const c = canvas(TEX_W, TEX_H)
  const ctx = c.getContext('2d')
  const w = TEX_W
  const h = TEX_H

  // Fundo escuro sutil
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
  ctx.fillText('Gabriela Lima', 120, h * 0.52)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
  ctx.font = `450 26px ${FONT}`
  ctx.fillText('Cartão de demonstração independente.', 120, h * 0.62)
  ctx.fillText('Não possui valor monetário real.', 120, h * 0.65)

  // Logotipo no verso
  drawNuVector(ctx, w - 240, h * 0.86, 120, 'rgba(255,255,255,0.7)')

  return c
}

// Chip EMV metálico prateado com cantos arredondados e contatos elétricos em baixo relevo
export function drawChip() {
  const W = 512
  const H = 392
  const c = canvas(W, H)
  const ctx = c.getContext('2d')

  // Gradiente metálico prateado com brilho acetinado
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#f0f0f4')
  g.addColorStop(0.3, '#dcdce2')
  g.addColorStop(0.7, '#c6c6ce')
  g.addColorStop(1, '#a8a8b2')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Linhas dos contatos do chip
  ctx.strokeStyle = 'rgba(64, 64, 76, 0.65)'
  ctx.lineWidth = 5
  ctx.lineJoin = 'round'

  ctx.beginPath()
  // Linhas horizontais externas
  ctx.moveTo(0, H * 0.32)
  ctx.lineTo(W * 0.28, H * 0.32)
  ctx.lineTo(W * 0.28, H * 0.18)

  ctx.moveTo(0, H * 0.68)
  ctx.lineTo(W * 0.28, H * 0.68)
  ctx.lineTo(W * 0.28, H * 0.82)

  ctx.moveTo(W, H * 0.32)
  ctx.lineTo(W * 0.72, H * 0.32)
  ctx.lineTo(W * 0.72, H * 0.18)

  ctx.moveTo(W, H * 0.68)
  ctx.lineTo(W * 0.72, H * 0.68)
  ctx.lineTo(W * 0.72, H * 0.82)

  // Linhas verticais
  ctx.moveTo(W * 0.28, H * 0.18)
  ctx.lineTo(W * 0.28, 0)

  ctx.moveTo(W * 0.72, H * 0.18)
  ctx.lineTo(W * 0.72, 0)

  ctx.moveTo(W * 0.28, H * 0.82)
  ctx.lineTo(W * 0.28, H)

  ctx.moveTo(W * 0.72, H * 0.82)
  ctx.lineTo(W * 0.72, H)
  ctx.stroke()

  // Ilha central do chip
  roundedPath(ctx, W * 0.28, H * 0.18, W * 0.44, H * 0.64, 28)
  ctx.stroke()

  return c
}

export function drawBump(metal) {
  const c = canvas(512, 512)
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)
  if (metal) {
    for (let i = 0; i < 1400; i++) {
      const v = 95 + Math.random() * 85
      ctx.fillStyle = `rgba(${v},${v},${v},0.5)`
      ctx.fillRect(0, Math.random() * 512, 512, 1)
    }
  } else {
    ctx.globalAlpha = 0.4
    ctx.drawImage(noiseTile(512, 1), 0, 0)
  }
  return c
}

export function tex(canvasEl, { srgb = true, aniso = 16, repeat } = {}) {
  const t = new THREE.CanvasTexture(canvasEl)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = aniso
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
  }
  return t
}
