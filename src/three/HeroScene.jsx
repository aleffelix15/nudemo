import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import NuCard from './NuCard'
import { getSharedCardKit } from './cardKit'
import { applyStudioEnvironment, radialTexture } from './stage'
import { HERO, easeInOutCubic, EPSILON } from './motion'
import { VARIANTS } from './cardArt'
import { useIsMobile, useIsSmallMobile, useIsCoarsePointer, getScrollY } from './hooks'

const FLOOR_Y = -2.15

function FloorShadow({ refObj }) {
  const map = useMemo(
    () =>
      radialTexture([
        [0, 'rgba(20, 5, 40, 0.5)'],
        [0.35, 'rgba(20, 5, 40, 0.22)'],
        [0.7, 'rgba(20, 5, 40, 0.05)'],
        [1, 'rgba(20, 5, 40, 0)'],
      ]),
    []
  )
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh ref={refObj} position={[0, FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[3.6, 2.4]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Scene({ reduced, interactive, running, onReady, isMobile, isSmallMobile }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const viewport = useThree((s) => s.viewport)
  const invalidate = useThree((s) => s.invalidate)

  const kit = useMemo(() => getSharedCardKit(gl.capabilities.getMaxAnisotropy()), [gl])

  useEffect(() => {
    const env = applyStudioEnvironment(gl, scene)
    invalidate()
    onReady?.()
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [gl, scene, invalidate, onReady])

  const card = useRef()
  const rig = useRef()
  const shadow = useRef()
  const isSleeping = useRef(false)
  const st = useRef({ t: 0, variant: 0, px: 0, py: 0, tx: 0, ty: 0, scroll: 0 })

  const wakeUp = () => {
    if (isSleeping.current) {
      isSleeping.current = false
      invalidate()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', wakeUp, { passive: true })
    window.addEventListener('resize', wakeUp, { passive: true })
    if (interactive && !reduced && !isMobile) {
      window.addEventListener('pointermove', wakeUp, { passive: true })
    }
    return () => {
      window.removeEventListener('scroll', wakeUp)
      window.removeEventListener('resize', wakeUp)
      if (interactive && !reduced && !isMobile) {
        window.removeEventListener('pointermove', wakeUp)
      }
    }
  }, [interactive, reduced, isMobile])

  useEffect(() => {
    if (!interactive || reduced || isMobile) return
    const move = (e) => {
      st.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      st.current.ty = (e.clientY / window.innerHeight) * 2 - 1
      wakeUp()
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [interactive, reduced, isMobile])

  useFrame((_, rawDt) => {
    // Suspende cálculos quando fora da viewport
    if (!running && !reduced) return
    const s = st.current
    const dt = Math.min(rawDt, 0.05)
    const g = card.current?.group
    if (!g) return

    // Respeito estrito a prefers-reduced-motion: pose estática elegante
    if (reduced) {
      g.rotation.set(HERO.reducedPitch, HERO.reducedYaw, HERO.reducedTilt)
      if (shadow.current) {
        shadow.current.scale.set(0.9, 0.85, 1)
        shadow.current.material.opacity = 0.5
      }
      return
    }

    const period = HERO.dwell + HERO.spin
    s.t += dt
    const cycle = Math.floor(s.t / period)
    const phase = s.t - cycle * period
    let u = 0
    if (phase > HERO.dwell) u = (phase - HERO.dwell) / HERO.spin
    const angle = Math.PI * 2 * easeInOutCubic(u)
    const variant = (cycle + (u >= HERO.swapAt ? 1 : 0)) % VARIANTS.length

    if (variant !== s.variant) {
      s.variant = variant
      card.current?.setVariant(variant)
    }

    const prevPx = s.px
    const prevPy = s.py
    const prevScroll = s.scroll

    // Amortecimento suave de ponteiro (THREE.MathUtils.damp, sem jitter)
    s.px = THREE.MathUtils.damp(s.px, s.tx, 3.5, dt)
    s.py = THREE.MathUtils.damp(s.py, s.ty, 3.5, dt)

    // Amortecimento suave do scroll sem re-render
    const targetScroll = getScrollY()
    s.scroll = THREE.MathUtils.damp(s.scroll, targetScroll, 4, dt)

    const rotX = HERO.basePitch + s.py * HERO.pointerPitch
    const rotY = HERO.baseYaw + angle + s.scroll * HERO.scrollYaw + s.px * HERO.pointerYaw
    const rotZ = HERO.tilt

    g.rotation.set(rotX, rotY, rotZ)

    if (shadow.current) {
      const apparent = Math.abs(Math.cos(rotY))
      shadow.current.scale.set(0.6 + 0.45 * apparent, 0.85, 1)
      shadow.current.material.opacity = 0.45 + 0.3 * apparent
    }

    // Verificação de convergência (epsilon check): para o loop quando atinge o repouso
    const delta =
      Math.abs(s.px - prevPx) +
      Math.abs(s.py - prevPy) +
      Math.abs(s.scroll - prevScroll) * HERO.scrollYaw

    if (delta >= EPSILON || phase > HERO.dwell) {
      invalidate()
    } else {
      isSleeping.current = true
    }
  })

  // Escala adaptativa para não cortar em telas estreitas (320px - 480px)
  const baseScale = isSmallMobile ? 0.74 : isMobile ? 0.84 : 1
  const k = THREE.MathUtils.clamp((viewport.width / 5.2) * baseScale, 0.44, 1.05)

  return (
    <group ref={rig} scale={k} position={[0.02, 0.05, 0]}>
      <NuCard ref={card} kit={kit} variant={0} />
      <FloorShadow refObj={shadow} />
      {/* Iluminação de estúdio: máximo 2 luzes direcionais + 1 ambient no mobile */}
      <ambientLight intensity={0.45} color="#f5f0fa" />
      <directionalLight position={[3, 4.5, 5]} intensity={1.15} color="#ffffff" />
      {!isMobile && <directionalLight position={[-3, 2, 4]} intensity={0.45} color="#eedeff" />}
      <directionalLight position={[-4, 1.5, -3]} intensity={0.8} color="#b98cff" />
    </group>
  )
}

export default function HeroScene({ reduced, interactive, running, onReady }) {
  const isMobile = useIsMobile()
  const isSmallMobile = useIsSmallMobile()
  const isCoarse = useIsCoarsePointer()

  return (
    <Canvas
      className="hero-canvas"
      style={{
        touchAction: 'pan-y',
        pointerEvents: isCoarse ? 'none' : 'auto',
      }}
      frameloop="demand"
      dpr={isMobile ? [1, 1.25] : [1, 2]}
      camera={{
        position: [0, 0.2, isSmallMobile ? 11.2 : isMobile ? 10.4 : 9.5],
        fov: 28,
        near: 0.5,
        far: 40,
      }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl, camera }) => {
        gl.domElement.style.touchAction = 'pan-y'
        if (isCoarse) {
          gl.domElement.style.pointerEvents = 'none'
        }
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        camera.lookAt(0, 0, 0)
      }}
      aria-label="Modelo tridimensional interativo do cartão de crédito Nubank"
      role="img"
    >
      <Scene
        reduced={reduced}
        interactive={interactive && !isCoarse}
        running={running}
        onReady={onReady}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
      />
    </Canvas>
  )
}
