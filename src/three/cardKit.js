import * as THREE from 'three'
import { VARIANTS, TEX_W, TEX_H, drawFront, drawBack, drawChip, drawBump, tex } from './cardArt'
import { CARD, makeSlabGeometry, makeFaceGeometry, makeChipGeometry } from './cardGeometry'

// Posição 3D calculada do chip EMV sobre a face vertical
export const CHIP_POS = {
  x: ((793 / TEX_W) - 0.5) * CARD.w,
  y: (0.5 - (191 / TEX_H)) * CARD.h,
}

// Cria kit de geometrias, texturas e materiais PBR de alta fidelidade
export function createCardKit(maxAniso = 16) {
  const disposables = []
  const keep = (o) => {
    disposables.push(o)
    return o
  }

  const slab = keep(makeSlabGeometry())
  const face = keep(makeFaceGeometry())
  const chipGeo = keep(makeChipGeometry(0.307, 0.236, 0.038))
  const chipTex = keep(tex(drawChip(), { aniso: maxAniso }))

  // Material metálico dedicado para o chip EMV
  const chipMat = keep(
    new THREE.MeshStandardMaterial({
      map: chipTex,
      metalness: 0.85,
      roughness: 0.22,
      color: '#D4D4D8',
      envMapIntensity: 1.3,
    })
  )

  const variants = VARIANTS.map((v, i) => {
    const bump = keep(tex(drawBump(v.metal), { srgb: false, aniso: 4, repeat: v.metal ? [1, 1] : [2, 3] }))
    const front = keep(tex(drawFront(i), { aniso: maxAniso }))
    const back = keep(tex(drawBack(i), { aniso: maxAniso }))

    // MeshPhysicalMaterial com especificações exatas de PBR
    const matProps = v.metal
      ? {
          metalness: 0.85,
          roughness: 0.26,
          clearcoat: 0.18,
          clearcoatRoughness: 0.2,
          envMapIntensity: 1.5,
        }
      : {
          metalness: 0.15,
          roughness: 0.28,
          clearcoat: 0.35,
          clearcoatRoughness: 0.25,
          envMapIntensity: 1.15,
        }

    const mk = (map) =>
      keep(
        new THREE.MeshPhysicalMaterial({
          map,
          bumpMap: bump,
          bumpScale: v.metal ? 0.3 : 0.08,
          ...matProps,
        })
      )

    const edge = keep(
      new THREE.MeshPhysicalMaterial({
        color: v.edge,
        metalness: v.metal ? 0.85 : 0.12,
        roughness: v.metal ? 0.28 : 0.35,
        clearcoat: v.metal ? 0.15 : 0.3,
        envMapIntensity: 1.05,
      })
    )

    return { front: mk(front), back: mk(back), edge, frontMap: front, meta: v }
  })

  return {
    slab,
    face,
    chipGeo,
    chipMat,
    variants,
    dispose() {
      disposables.forEach((d) => d && typeof d.dispose === 'function' && d.dispose())
    },
  }
}
