import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import NuCard from './NuCard'
import { getSharedCardKit } from './cardKit'
import { applyStudioEnvironment, disposeStudioEnvironment, getContactShadowTexture, getAmbientShadowTexture } from './stage'
import { HERO, easeInOutCubic, EPSILON } from './motion'
import { VARIANTS } from './cardArt'
import { useIsMobile, useIsSmallMobile, useIsCoarsePointer, getScrollY } from './hooks'
import CardFallback from '../components/CardFallback'

const FLOOR_Y = -2.15

// Sombra em duas camadas: contato estreito e escuro + ambiente suave e difuso
function TwoTierShadow({ contactRef, ambientRef }) {
  const contactMap = useMemo(() => getContactShadowTexture(), [])
  const ambientMap = useMemo(() => getAmbientShadowTexture(), [])

  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* 1. Sombra ambiente suave e ampla */}
      <mesh ref={ambientRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2} position={[0, -0.002, 0]}>
        <planeGeometry args={[3.8, 2.4]} />
        <meshBasicMaterial map={ambientMap} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {/* 2. Sombra de contato escura diretamente sob a base do cartão */}
      <mesh ref={contactRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1} position={[0, 0, 0]}>
        <planeGeometry args={[2.2, 0.9]} />
        <meshBasicMaterial map={contactMap} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Scene({ reduced, interactive, running, onReady, isMobile, isSmallMobile, manualVariant, isPaused, isFlipped }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const viewport = useThree((s) => s.viewport)
  const invalidate = useThree((s) => s.invalidate)

  const kit = useMemo(() => getSharedCardKit(gl.capabilities.getMaxAnisotropy()), [gl])

  // onReady fica em ref: a identidade da função não pode recriar o ambiente PMREM
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const firedReady = useRef(false)

  useEffect(() => {
    applyStudioEnvironment(gl, scene)
    let cancelled = false
    if (typeof gl.compileAsync === 'function') {
      gl.compileAsync(scene, camera).then(() => {
        if (!cancelled) invalidate()
      }).catch(() => {
        if (!cancelled) invalidate()
      })
    } else {
      invalidate()
    }
    return () => {
      cancelled = true
      scene.environment = null
      disposeStudioEnvironment?.(gl)
    }
  }, [gl, scene, camera, invalidate])

  const card = useRef()
  const rig = useRef()
  const contactShadow = useRef()
  const ambientShadow = useRef()
  const isSleeping = useRef(false)
  const dwellTimer = useRef(null)
  const st = useRef({ t: 0, variant: 0, px: 0, py: 0, tx: 0, ty: 0, scroll: 0, flipAngle: 0, lastNow: performance.now() })

  const runningRef = useRef(running)
  runningRef.current = running

  const wakeUp = () => {
    if (!runningRef.current) return
    isSleeping.current = false
    invalidate()
  }

  // Desperta a renderização quando running passa para true
  useEffect(() => {
    if (running) {
      st.current.lastNow = performance.now() // o tempo fora da tela não conta
      invalidate()
    }
  }, [running, invalidate])

  // Responde imediatamente aos controles interativos manuais
  useEffect(() => {
    wakeUp()
    if (manualVariant !== null && manualVariant !== undefined) {
      st.current.variant = manualVariant
      card.current?.setVariant(manualVariant)
    }
    if (isFlipped) {
      card.current?.ensureBack?.()
    }
  }, [manualVariant, isPaused, isFlipped])

  useEffect(() => {
    window.addEventListener('scroll', wakeUp, { passive: true })
    window.addEventListener('resize', wakeUp, { passive: true })
    return () => {
      window.removeEventListener('scroll', wakeUp)
      window.removeEventListener('resize', wakeUp)
      if (dwellTimer.current) {
        clearTimeout(dwellTimer.current)
        dwellTimer.current = null
      }
    }
  }, [])

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
    if (!running && !reduced) {
      isSleeping.current = true
      return
    }

    const s = st.current
    const now = performance.now()
    // Relógio real: o limite só protege contra aba oculta. Pausa trava o relógio de rotação.
    const realDt = isPaused ? 0 : Math.min((now - s.lastNow) / 1000, 1.5)
    s.lastNow = now

    const dt = Math.min(rawDt, 0.05)
    const g = card.current?.group
    if (!g) return

    // Avisa o pai só depois do primeiro frame desenhado
    if (!firedReady.current) {
      firedReady.current = true
      requestAnimationFrame(() => onReadyRef.current?.())
    }

    if (reduced) {
      g.rotation.set(HERO.reducedPitch, HERO.reducedYaw, HERO.reducedTilt)
      if (contactShadow.current && ambientShadow.current) {
        contactShadow.current.scale.set(0.9, 0.85, 1)
        contactShadow.current.material.opacity = 0.65
        ambientShadow.current.scale.set(0.95, 0.9, 1)
        ambientShadow.current.material.opacity = 0.45
      }
      return
    }

    const period = HERO.dwell + HERO.spin
    // O tempo avança com o relógio real para que o repouso termine sozinho
    s.t += realDt
    const cycle = Math.floor(s.t / period)
    const phase = s.t - cycle * period
    let u = 0
    if (!isPaused) {
      if (phase > HERO.dwell) {
        u = (phase - HERO.dwell) / HERO.spin
        if (dwellTimer.current) {
          clearTimeout(dwellTimer.current)
          dwellTimer.current = null
        }
      } else {
        // Agenda despertar no término do repouso para iniciar o giro autonomamente
        if (!dwellTimer.current) {
          const remainingDwell = Math.max(16, (HERO.dwell - phase) * 1000)
          dwellTimer.current = setTimeout(() => {
            dwellTimer.current = null
            wakeUp()
          }, remainingDwell)
        }
      }
    }

    const angle = isPaused ? 0 : Math.PI * 2 * easeInOutCubic(u)
    const variant = manualVariant !== null && manualVariant !== undefined
      ? manualVariant
      : (cycle + (u >= HERO.swapAt ? 1 : 0)) % VARIANTS.length

    if (variant !== s.variant) {
      s.variant = variant
      card.current?.setVariant(variant)
    }

    // Suavização do giro de 180°
    const targetFlip = isFlipped ? Math.PI : 0
    const prevFlip = s.flipAngle
    s.flipAngle = THREE.MathUtils.damp(s.flipAngle, targetFlip, 6, dt)

    const prevPx = s.px
    const prevPy = s.py
    const prevScroll = s.scroll

    s.px = THREE.MathUtils.damp(s.px, s.tx, 3.5, dt)
    s.py = THREE.MathUtils.damp(s.py, s.ty, 3.5, dt)

    const targetScroll = getScrollY()
    s.scroll = THREE.MathUtils.damp(s.scroll, targetScroll, 4, dt)

    const rotX = HERO.basePitch + s.py * HERO.pointerPitch
    const rotY = HERO.baseYaw + angle + s.flipAngle + s.scroll * HERO.scrollYaw + s.px * HERO.pointerYaw
    const rotZ = HERO.tilt

    g.rotation.set(rotX, rotY, rotZ)

    if (contactShadow.current && ambientShadow.current) {
      const apparent = Math.abs(Math.cos(rotY))
      contactShadow.current.scale.set(0.45 + 0.5 * apparent, 0.8, 1)
      contactShadow.current.material.opacity = 0.5 + 0.35 * apparent

      ambientShadow.current.scale.set(0.65 + 0.35 * apparent, 0.85, 1)
      ambientShadow.current.material.opacity = 0.3 + 0.25 * apparent
    }

    const delta =
      Math.abs(s.px - prevPx) +
      Math.abs(s.py - prevPy) +
      Math.abs(s.flipAngle - prevFlip) +
      Math.abs(s.scroll - prevScroll) * HERO.scrollYaw

    if (delta >= EPSILON || (!isPaused && (phase > HERO.dwell || u > 0))) {
      invalidate()
    } else {
      isSleeping.current = true
    }
  })

  const baseScale = isSmallMobile ? 0.74 : isMobile ? 0.84 : 1
  const k = THREE.MathUtils.clamp((viewport.width / 5.2) * baseScale, 0.44, 1.05)

  return (
    <group ref={rig} scale={k} position={[0.02, 0.05, 0]}>
      <NuCard ref={card} kit={kit} variant={0} />
      <TwoTierShadow contactRef={contactShadow} ambientRef={ambientShadow} />
      {/* Iluminação de estúdio fotorealista: key light superior frontal + rim light violeta de recorte */}
      <ambientLight intensity={0.68} color="#fcf8ff" />
      <directionalLight position={[2.5, 4.2, 4.2]} intensity={1.35} color="#ffffff" />
      <directionalLight position={[-3.6, 1.6, -3.2]} intensity={0.85} color="#b88cff" />
    </group>
  )
}

export default function HeroScene({
  reduced,
  interactive,
  running,
  onReady,
  manualVariant = null,
  isPaused = false,
  isFlipped = false,
}) {
  const isMobile = useIsMobile()
  const isSmallMobile = useIsSmallMobile()
  const isCoarse = useIsCoarsePointer()
  const [contextLost, setContextLost] = useState(false)
  const invalidateRef = useRef(null)

  return (
    <>
      {contextLost && <CardFallback />}
      <Canvas
        className="hero-canvas"
        style={{
          touchAction: 'pan-y',
          pointerEvents: isCoarse ? 'none' : 'auto',
          display: contextLost ? 'none' : 'block',
        }}
        frameloop="demand"
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
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
        onCreated={({ gl, camera, invalidate }) => {
          invalidateRef.current = invalidate
          // Desativa consultas síncronas de validação de shaders em produção para eliminar pausas de GPU no primeiro frame
          if (gl.debug) {
            gl.debug.checkShaderErrors = false
          }
          const dom = gl.domElement
          dom.style.touchAction = 'pan-y'
          if (isCoarse) {
            dom.style.pointerEvents = 'none'
          }
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.42
          camera.lookAt(0, 0, 0)

          const onLost = (e) => {
            e.preventDefault()
            setContextLost(true)
          }
          const onRestored = () => {
            setContextLost(false)
            invalidateRef.current?.()
          }
          dom.addEventListener('webglcontextlost', onLost, false)
          dom.addEventListener('webglcontextrestored', onRestored, false)
        }}
        aria-label="Modelo tridimensional interativo do cartão de crédito Nubank"
        role="img"
      >
        <Scene
          reduced={reduced}
          interactive={interactive && !isCoarse}
          running={running && !contextLost}
          onReady={onReady}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
          manualVariant={manualVariant}
          isPaused={isPaused}
          isFlipped={isFlipped}
        />
      </Canvas>
    </>
  )
}
