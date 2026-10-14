import { useEffect, useState } from 'react'

export function useMedia(query, initial = false) {
  const [m, setM] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

export const useIsMobile = () => useMedia('(max-width: 820px)')
export const useReducedMotionMQ = () => useMedia('(prefers-reduced-motion: reduce)')

export function useInView(ref, margin = '100px') {
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return v
}

// Hook de visibilidade dedicado para controle de ciclo de vida e economia de GPU nas cenas WebGL
export function useCanvasVisibility(ref, margin = '120px') {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref?.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { rootMargin: margin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return visible
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// Fontes carregadas antes de desenhar texturas com texto
export function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    const load = document.fonts?.load
      ? Promise.all([
          document.fonts.load('800 100px "Figtree Variable"'),
          document.fonts.load('600 60px "Figtree Variable"'),
          document.fonts.load('500 50px "Figtree Variable"'),
        ])
      : Promise.resolve()
    load.catch(() => {}).finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])
  return ready
}
