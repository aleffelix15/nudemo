// Parâmetros de movimento físico do cartão com amortecimento suave
export const HERO = {
  dwell: 1.2, // segundos em repouso de frente
  spin: 1.0, // segundos para giro de exibição
  swapAt: 0.75, // momento em que o cartão está de perfil para trocar a variante
  tilt: 0.24, // inclinação elegante no plano da tela (~13.7°)
  baseYaw: -0.24, // rotação de repouso sutil
  basePitch: -0.06,
  scrollYaw: 0.0018, // rotação controlada guiada pelo scroll
  pointerYaw: 0.1396, // inclinação máxima guiada pelo ponteiro (máximo ±8° = 0.1396 rad)
  pointerPitch: 0.09, // inclinação vertical sutil
  reducedYaw: -0.2, // ângulo estático elegante para prefers-reduced-motion
  reducedPitch: -0.04,
  reducedTilt: 0.18,
}

export const STACK = {
  copies: 7,
  copiesMobile: 4,
  gap: 0.42,
  dir: [0.75, -0.65, -0.45],
  rot: [-0.45, 0.24, 0.28],
}

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const smooth = (t) => t * t * (3 - 2 * t)

// Tolerância estrita para parada completa do loop 3D (Render on Demand a 0% GPU)
export const EPSILON = 0.0008
