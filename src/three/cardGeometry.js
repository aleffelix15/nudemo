import * as THREE from 'three'

// Proporção oficial ISO/IEC 7810 ID-1: 53,98 x 85,60 x 0,76 mm (orientação vertical autêntica)
// Proporção 1 : 1.5858
export const CARD = {
  w: 2.159,
  h: 3.424,
  depth: 0.024, // espessura de policarbonato (~0.02 unidades)
  bevel: 0.0035, // chanfro microscópico para capturar rim light
  radius: 0.13, // cantos arredondados suaves (~0.06 da largura)
}

export const CARD_FACE_Z = CARD.depth / 2 + CARD.bevel

export function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

export const isMobileDevice = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))

// Cache singleton em nível de módulo para reutilização universal
let cachedSlab = null
let cachedFace = null
let cachedChip = null

// Miolo do cartão: placa vertical extrudada com chanfro microscópico
export function makeSlabGeometry(isMobile = isMobileDevice()) {
  const { w, h, radius: r, depth, bevel: b } = CARD
  const g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
    depth,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments: isMobile ? 2 : 3,
    curveSegments: isMobile ? 12 : 32,
  })
  g.translate(0, 0, -depth / 2)
  g.computeVertexNormals()
  return g
}

export function getSlabGeometry(isMobile = isMobileDevice()) {
  if (!cachedSlab) {
    cachedSlab = makeSlabGeometry(isMobile)
  }
  return cachedSlab
}

// Face de impressão vertical (frente e verso), com UV mapeado 0..1
export function makeFaceGeometry(inset = CARD.bevel, isMobile = isMobileDevice()) {
  const w = CARD.w - inset * 2
  const h = CARD.h - inset * 2
  const g = new THREE.ShapeGeometry(roundedRect(w, h, CARD.radius - inset), isMobile ? 12 : 32)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  }
  uv.needsUpdate = true
  return g
}

export function getFaceGeometry(inset = CARD.bevel, isMobile = isMobileDevice()) {
  if (!cachedFace) {
    cachedFace = makeFaceGeometry(inset, isMobile)
  }
  return cachedFace
}

// Chip EMV metálico com relevo físico 3D real e bordas chanfradas
export function makeChipGeometry(w = 0.307, h = 0.236, r = 0.038, depth = 0.0018, isMobile = isMobileDevice()) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.0006,
    bevelSize: 0.0006,
    bevelSegments: isMobile ? 1 : 2,
    curveSegments: isMobile ? 8 : 16,
  })
  g.translate(0, 0, -depth / 2)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  }
  uv.needsUpdate = true
  g.computeVertexNormals()
  return g
}

export function getChipGeometry(w = 0.307, h = 0.236, r = 0.038, depth = 0.0018, isMobile = isMobileDevice()) {
  if (!cachedChip) {
    cachedChip = makeChipGeometry(w, h, r, depth, isMobile)
  }
  return cachedChip
}
