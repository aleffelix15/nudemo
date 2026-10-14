/**
 * Qualidade e detecção adaptativa de dispositivos.
 * Classifica a sessão em 'low' ou 'high' e reage a mudanças de viewport em runtime.
 */

export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  const isNarrow = window.innerWidth < 768
  const isCoarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
  return isNarrow || (isCoarse && window.innerWidth < 1024)
}

export function getQualityTier() {
  if (typeof window === 'undefined') return 'high'
  const isNarrow = window.innerWidth < 768
  const isCoarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
  const concurrency = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 8

  // Dispositivos móveis, telas estreitas ou CPUs com <= 4 núcleos lógicos usam low tier
  if (isNarrow || (isCoarse && window.innerWidth < 1024) || concurrency <= 4) {
    return 'low'
  }
  return 'high'
}

let currentTier = typeof window !== 'undefined' ? getQualityTier() : 'high'
const tierListeners = new Set()

export function onQualityTierChange(callback) {
  tierListeners.add(callback)
  return () => tierListeners.delete(callback)
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'resize',
    () => {
      const next = getQualityTier()
      if (next !== currentTier) {
        currentTier = next
        tierListeners.forEach((cb) => {
          try {
            cb(next)
          } catch (e) {
            console.error('[quality] Tier change listener error:', e)
          }
        })
      }
    },
    { passive: true }
  )
}
