import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export const isMobileDevice = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))

// Ambiente de estúdio procedural (softboxes) balanceado para acabamento acetinado de fintech
export function applyStudioEnvironment(gl, scene) {
  const isMobile = isMobileDevice()
  if (isMobile) {
    if (gl.shadowMap) gl.shadowMap.enabled = false
  }

  const pmrem = new THREE.PMREMGenerator(gl)
  // No mobile, usa resolução reduzida (0.08) para inicialização instantânea e economia de VRAM
  const env = pmrem.fromScene(new RoomEnvironment(), isMobile ? 0.08 : 0.04).texture
  scene.environment = env
  scene.environmentIntensity = isMobile ? 0.75 : 0.85
  pmrem.dispose()
  return env
}

export function radialTexture(stops, size = (isMobileDevice() ? 128 : 256)) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.generateMipmaps = !isMobileDevice()
  t.minFilter = isMobileDevice() ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
  return t
}
