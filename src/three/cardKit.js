import * as THREE from 'three'
import { VARIANTS, TEX_W, TEX_H, drawFront, drawBack, drawChip, drawBump, tex } from './cardArt'
import { CARD, getSlabGeometry, getFaceGeometry, getChipGeometry, isMobileDevice } from './cardGeometry'

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

// Cria kit de geometrias, texturas e materiais PBR com resposta especular contrastada
export function createCardKit(maxAniso = 16) {
  if (sharedCardKit) return sharedCardKit

  const isMobile = isMobileDevice()
  const effectiveAniso = isMobile ? 4 : maxAniso
  const precision = isMobile ? 'mediump' : 'highp'

  const slab = getSlabGeometry(isMobile)
  const face = getFaceGeometry(CARD.bevel, isMobile)
  const chipGeo = getChipGeometry(0.307, 0.236, 0.038, 0.0018, isMobile)
  const chipTex = tex(drawChip(), { aniso: effectiveAniso })

  // Material metálico dedicado do chip EMV com resposta especular intensa
  const chipMat = new THREE.MeshStandardMaterial({
    map: chipTex,
    metalness: 0.88,
    roughness: 0.20,
    color: '#D4D4D8',
    envMapIntensity: isMobile ? 1.0 : 1.4,
    precision,
  })

  const variants = VARIANTS.map((v, i) => {
    const bump = tex(drawBump(v.metal), { srgb: false, aniso: isMobile ? 2 : 4, repeat: v.metal ? [1, 1] : [2, 3] })
    const front = tex(drawFront(i), { aniso: effectiveAniso })
    const back = tex(drawBack(i), { aniso: effectiveAniso })

    // MeshPhysicalMaterial com especificações físicas do policarbonato roxo e metal escovado
    const matProps = v.metal
      ? {
          metalness: 0.85,
          roughness: 0.25,
          clearcoat: isMobile ? 0.12 : 0.18,
          clearcoatRoughness: 0.20,
          envMapIntensity: isMobile ? 1.0 : 1.5,
          precision,
        }
      : {
          metalness: 0.15,
          roughness: 0.30,
          clearcoat: isMobile ? 0.22 : 0.35,
          clearcoatRoughness: 0.25,
          envMapIntensity: isMobile ? 0.95 : 1.15,
          precision,
        }

    const mk = (map) =>
      new THREE.MeshPhysicalMaterial({
        map,
        bumpMap: bump,
        bumpScale: v.metal ? 0.25 : 0.07,
        ...matProps,
      })

    const edge = new THREE.MeshPhysicalMaterial({
      color: v.edge,
      metalness: v.metal ? 0.85 : 0.15,
      roughness: v.metal ? 0.25 : 0.30,
      clearcoat: isMobile ? 0.12 : 0.25,
      envMapIntensity: isMobile ? 0.9 : 1.1,
      precision,
    })

    return { front: mk(front), back: mk(back), edge, frontMap: front, meta: v }
  })

  const kit = {
    slab,
    face,
    chipGeo,
    chipMat,
    variants,
    dispose() {
      // Como o kit é um singleton reutilizado entre telas, mantemos vivo para evitar recriação
    },
  }

  sharedCardKit = kit
  return kit
}
