import * as THREE from 'three'

export const isMobileDevice = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))

// Cache fraco isolado por WebGLRenderer para evitar conflito entre Hero e Stack (B03)
const studioEnvMap = new WeakMap()

/**
 * Cria um ambiente de estúdio procedural dedicado com 3 softboxes retangulares:
 * 1. Faixa longa superior de luz branca (gera a varredura direcional de brilho no giro).
 * 2. Softbox lateral frio (preenchimento suave).
 * 3. Softbox violeta traseiro (rim light de perfil).
 */
export function getStudioEnvironment(gl) {
  if (studioEnvMap.has(gl)) return studioEnvMap.get(gl).texture

  const isMobile = isMobileDevice()
  const pmrem = new THREE.PMREMGenerator(gl)

  const studioScene = new THREE.Scene()
  studioScene.background = new THREE.Color('#0b0714')

  // 1. Faixa longa de topo (Key Strip Softbox): varre a superfície do cartão durante a rotação
  const keyMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  const keyGeo = new THREE.PlaneGeometry(2.8, 12.0)
  const keyMesh = new THREE.Mesh(keyGeo, keyMat)
  keyMesh.position.set(2.2, 5.0, 3.4)
  keyMesh.rotation.set(-Math.PI * 0.28, Math.PI * 0.18, -Math.PI * 0.12)
  studioScene.add(keyMesh)

  // 2. Lateral frio (Fill Softbox): reflexo suave azul-neutro
  const fillMat = new THREE.MeshBasicMaterial({ color: 0xdce6f6, side: THREE.DoubleSide })
  const fillGeo = new THREE.PlaneGeometry(3.6, 6.5)
  const fillMesh = new THREE.Mesh(fillGeo, fillMat)
  fillMesh.position.set(-4.5, 0.8, 2.8)
  fillMesh.rotation.set(0, Math.PI * 0.38, 0)
  studioScene.add(fillMesh)

  // 3. Rim violeta fraco (Rim Softbox): acentua o chanfro e a borda em perfil
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide })
  const rimGeo = new THREE.PlaneGeometry(3.2, 7.5)
  const rimMesh = new THREE.Mesh(rimGeo, rimMat)
  rimMesh.position.set(-2.8, 0.6, -3.8)
  rimMesh.rotation.set(0, -Math.PI * 0.32, 0)
  studioScene.add(rimMesh)

  // Gera PMREM com resolução otimizada
  const renderTarget = pmrem.fromScene(studioScene, isMobile ? 0.08 : 0.04)
  const texture = renderTarget.texture
  studioEnvMap.set(gl, { renderTarget, texture })

  // Limpa geometrias e materiais temporários
  keyGeo.dispose()
  keyMat.dispose()
  fillGeo.dispose()
  fillMat.dispose()
  rimGeo.dispose()
  rimMat.dispose()
  pmrem.dispose()

  return texture
}

export function disposeStudioEnvironment(gl) {
  if (gl && studioEnvMap.has(gl)) {
    const entry = studioEnvMap.get(gl)
    if (entry) {
      entry.renderTarget?.dispose?.()
      entry.texture?.dispose?.()
    }
    studioEnvMap.delete(gl)
  }
}

export function applyStudioEnvironment(gl, scene) {
  if (isMobileDevice() && gl.shadowMap) {
    gl.shadowMap.enabled = false
  }

  const env = getStudioEnvironment(gl)
  scene.environment = env
  return env
}

export function radialTexture(stops, size = isMobileDevice() ? 128 : 256) {
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

// Caches de sombra de contato e ambiente
let cachedContactShadow = null
let cachedAmbientShadow = null

export function getContactShadowTexture() {
  if (!cachedContactShadow) {
    cachedContactShadow = radialTexture([
      [0, 'rgba(12, 3, 24, 0.72)'],
      [0.35, 'rgba(12, 3, 24, 0.32)'],
      [0.75, 'rgba(12, 3, 24, 0.06)'],
      [1, 'rgba(12, 3, 24, 0)'],
    ], isMobileDevice() ? 128 : 256)
  }
  return cachedContactShadow
}

export function getAmbientShadowTexture() {
  if (!cachedAmbientShadow) {
    cachedAmbientShadow = radialTexture([
      [0, 'rgba(20, 6, 38, 0.28)'],
      [0.45, 'rgba(20, 6, 38, 0.12)'],
      [0.85, 'rgba(20, 6, 38, 0.02)'],
      [1, 'rgba(20, 6, 38, 0)'],
    ], isMobileDevice() ? 128 : 256)
  }
  return cachedAmbientShadow
}
