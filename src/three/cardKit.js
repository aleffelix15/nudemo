import * as THREE from 'three'
import { VARIANTS, TEX_W, TEX_H, drawFront, drawBack, drawChip, drawBump, tex } from './cardArt'
import { CARD, getSlabGeometry, getFaceGeometry, getChipGeometry } from './cardGeometry'
import { isMobileDevice, onQualityTierChange } from './quality.js'

// Posição 3D calculada do chip EMV sobre a face vertical
export const CHIP_POS = {
  x: ((793 / TEX_W) - 0.5) * CARD.w,
  y: (0.5 - (191 / TEX_H)) * CARD.h,
}

// Singleton global de kit para compartilhamento estrito entre HeroScene e StackScene
let sharedCardKit = null

export function getSharedCardKit(maxAniso = 16) {
  if (!sharedCardKit) {
    sharedCardKit = createCardKit(maxAniso)
  }
  return sharedCardKit
}

// Cria kit de geometrias, texturas e materiais PBR com acabamento fotorealista
export function createCardKit(maxAniso = 16) {
  if (sharedCardKit) return sharedCardKit

  const isMobile = isMobileDevice()
  const effectiveAniso = isMobile ? 4 : maxAniso
  const precision = isMobile ? 'mediump' : 'highp'

  const slab = getSlabGeometry(isMobile)
  const face = getFaceGeometry(CARD.bevel * 0.88, isMobile)
  const chipGeo = getChipGeometry(0.307, 0.236, 0.038, 0.0018, isMobile)
  const chipTex = tex(drawChip(), { aniso: effectiveAniso })

  // Material metálico dedicado do chip EMV em ouro/champagne sem resíduo cinza
  const chipMat = new THREE.MeshStandardMaterial({
    map: chipTex,
    metalness: 0.88,
    roughness: 0.22,
    color: '#ffffff', // Multiplicador neutro para preservar o ouro champagne autêntico
    precision,
  })
  chipMat.userData.baseEnv = 1.3
  chipMat.envMapIntensity = chipMat.userData.baseEnv * (isMobile ? 0.8 : 1.05)

  const variants = VARIANTS.map((v, i) => {
    const bump = tex(drawBump(v.metal), { srgb: false, aniso: isMobile ? 2 : 4, repeat: v.metal ? [1, 1] : [2, 3] })
    const front = tex(drawFront(i), { aniso: effectiveAniso })
    const back = tex(drawBack(i), { aniso: effectiveAniso })

    // Configuração de material para face frontal
    const frontMat = isMobile
      ? new THREE.MeshStandardMaterial({
          map: front,
          roughness: 0.28,
          metalness: v.metal ? 0.85 : 0.06,
          precision: 'mediump',
        })
      : new THREE.MeshPhysicalMaterial({
          map: front,
          bumpMap: bump,
          bumpScale: v.metal ? 0.22 : 0.06,
          metalness: v.metal ? 0.88 : 0.06, // Roxo < 0.1 conforme especificação
          roughness: v.metal ? 0.24 : 0.28,
          clearcoat: v.metal ? 0.15 : 0.35,
          clearcoatRoughness: 0.22,
          anisotropy: v.metal ? 0.85 : 0, // Reflexo anisotrópico escovado horizontal para Ultravioleta
          anisotropyRotation: 0,
          precision,
        })
    frontMat.userData.baseEnv = v.metal ? 1.35 : 1.15
    frontMat.envMapIntensity = frontMat.userData.baseEnv * (isMobile ? 0.8 : 1.05)

    // Verso usa MeshStandardMaterial (economia de GPU, clearcoat desnecessário no verso)
    const backMat = new THREE.MeshStandardMaterial({
      map: back,
      roughness: 0.34,
      metalness: v.metal ? 0.75 : 0.05,
      precision,
    })
    backMat.userData.baseEnv = v.metal ? 1.0 : 0.9
    backMat.envMapIntensity = backMat.userData.baseEnv * (isMobile ? 0.8 : 1.05)

    // Borda chanfrada ISO que reflete o rim light de estúdio
    const edge = isMobile
      ? new THREE.MeshStandardMaterial({
          color: v.edge,
          roughness: 0.26,
          metalness: v.metal ? 0.85 : 0.08,
          precision: 'mediump',
        })
      : new THREE.MeshPhysicalMaterial({
          color: v.edge,
          metalness: v.metal ? 0.88 : 0.08,
          roughness: 0.26,
          clearcoat: 0.30,
          clearcoatRoughness: 0.20,
          precision,
        })
    edge.userData.baseEnv = v.metal ? 1.25 : 1.0
    edge.envMapIntensity = edge.userData.baseEnv * (isMobile ? 0.8 : 1.05)

    return { front: frontMat, back: backMat, edge, frontMap: front, meta: v }
  })

  const kit = {
    slab,
    face,
    chipGeo,
    chipMat,
    variants,
    dispose() {
      slab.dispose()
      face.dispose()
      chipGeo.dispose()
      chipMat.dispose()
      chipTex.dispose()
      variants.forEach((v) => {
        v.front.map?.dispose?.()
        v.front.bumpMap?.dispose?.()
        v.front.dispose?.()
        v.back.map?.dispose?.()
        v.back.dispose?.()
        v.edge.dispose?.()
      })
      sharedCardKit = null
    },
  }

  sharedCardKit = kit
  return kit
}

export function updateCardKitTextures(kit = sharedCardKit) {
  if (!kit) return
  const isMobile = isMobileDevice()
  const effectiveAniso = isMobile ? 4 : 16

  kit.variants.forEach((v, i) => {
    const oldFrontMap = v.front.map
    const oldBackMap = v.back.map
    const oldBumpMap = v.front.bumpMap

    const newFront = tex(drawFront(i), { aniso: effectiveAniso })
    const newBack = tex(drawBack(i), { aniso: effectiveAniso })
    const newBump = tex(drawBump(v.meta.metal), {
      srgb: false,
      aniso: isMobile ? 2 : 4,
      repeat: v.meta.metal ? [1, 1] : [2, 3],
    })

    v.front.map = newFront
    if (v.front.bumpMap) v.front.bumpMap = newBump
    v.front.needsUpdate = true

    v.back.map = newBack
    v.back.needsUpdate = true

    v.frontMap = newFront

    // Descarta texturas antigas liberando memória GPU
    oldFrontMap?.dispose?.()
    oldBackMap?.dispose?.()
    oldBumpMap?.dispose?.()
  })
}

if (typeof window !== 'undefined') {
  onQualityTierChange(() => {
    if (sharedCardKit) {
      updateCardKitTextures(sharedCardKit)
    }
  })
}
