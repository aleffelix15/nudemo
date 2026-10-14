import { useEffect, useState, useRef } from 'react'

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

export const useIsMobile = () => useMedia('(max-width: 767px)')
export const useIsSmallMobile = () => useMedia('(max-width: 379px)')
export const useIsCoarsePointer = () => useMedia('(pointer: coarse)')
export const useReducedMotionMQ = () => useMedia('(prefers-reduced-motion: reduce)')

// Leitura reativa de scroll com listener passivo sem disparar setState
let globalScrollY = typeof window !== 'undefined' ? window.scrollY : 0
if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      globalScrollY = window.scrollY
    },
    { passive: true }
  )
}
export const getScrollY = () => globalScrollY

// Ignora eventos de resize quando window.innerWidth não mudou (barra de endereço mobile recolhendo)
export function isAddressBarResize(prevW, prevH, curW, curH) {
  return Math.abs(curW - prevW) <= 1
}

// Hook de cálculo ultra-otimizado de progresso de scroll com ZERO layout thrashing (zero getBoundingClientRect no scroll)
export function useSectionScrollProgress(targetRef) {
  const progress = useRef(0)
  const cachedMetrics = useRef({ top: 0, height: 1, vh: 800, lastW: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const measure = () => {
      const el = targetRef.current
      if (!el) return
      const curW = window.innerWidth
      const curH = window.innerHeight
      if (
        cachedMetrics.current.lastW > 0 &&
        isAddressBarResize(cachedMetrics.current.lastW, cachedMetrics.current.vh, curW, curH)
      ) {
        return
      }
      const r = el.getBoundingClientRect()
      cachedMetrics.current = {
        top: r.top + window.scrollY,
        height: r.height,
        vh: curH,
        lastW: curW,
      }
    }

    measure()

    const onScroll = () => {
      const { top, height, vh } = cachedMetrics.current
      const y = window.scrollY
      const total = height + vh
      const current = y + vh - top
      progress.current = Math.min(1, Math.max(0, current / total))
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [targetRef])

  return progress
}

// Montagem diferida: só instancia WebGL secundário quando o usuário estiver a 400px da seção
export function useNearViewport(ref, margin = '400px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: margin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return near
}

export function useInView(ref, margin = '250px 0px') {
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

// Hook de visibilidade dedicado para controle de ciclo de vida e economia de GPU nas cenas WebGL (pré-ativação em 250px)
export function useCanvasVisibility(ref, margin = '250px 0px') {
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

let cachedHasWebGL = null

export function hasWebGL() {
  if (cachedHasWebGL !== null) return cachedHasWebGL
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    cachedHasWebGL = !!gl
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    cachedHasWebGL = false
  }
  return cachedHasWebGL
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
