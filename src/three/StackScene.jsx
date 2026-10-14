import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import NuCard from './NuCard'
import { getSharedCardKit } from './cardKit'
import { applyStudioEnvironment, disposeStudioEnvironment } from './stage'
import { STACK, smooth, clamp01, EPSILON } from './motion'
import { CARD_FACE_Z } from './cardGeometry'
import { useIsMobile, useIsSmallMobile, useIsCoarsePointer } from './hooks'

function Ghost({ kit, refObj, index, total }) {
  // Cópias fantasma com degradê tonal elegante e borda sutilmente mais clara
  const mats = useMemo(() => {
    const ratio = index / Math.max(1, total - 1)
    const faceColor = new THREE.Color('#7808c4').lerp(new THREE.Color('#430268'), ratio)
    const edgeColor = new THREE.Color('#8e15df').lerp(new THREE.Color('#380056'), ratio)

    const f = new THREE.MeshStandardMaterial({
      color: faceColor,
      metalness: 0.08,
      roughness: 0.34,
      transparent: true,
      depthWrite: false,
      precision: 'mediump',
    })
    const e = new THREE.MeshStandardMaterial({
      color: edgeColor,
      metalness: 0.1,
      roughness: 0.36,
      transparent: true,
      depthWrite: false,
      precision: 'mediump',
    })
    return { f, e }
  }, [index, total])

  useEffect(() => () => {
    mats.f.dispose()
    mats.e.dispose()
  }, [mats])

  useEffect(() => {
    refObj.mats = mats
  }, [mats, refObj])

  return (
    <group ref={(g) => (refObj.group = g)}>
      <mesh geometry={kit.slab} material={mats.e} matrixAutoUpdate={false} onUpdate={(self) => self.updateMatrix()} />
      <mesh geometry={kit.face} material={mats.f} position={[0, 0, CARD_FACE_Z + 0.0002]} matrixAutoUpdate={false} onUpdate={(self) => self.updateMatrix()} />
    </group>
  )
}

function Scene({ progress, copies, reduced, running, isMobile, isSmallMobile }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)
  const viewport = useThree((s) => s.viewport)

  const kit = useMemo(() => getSharedCardKit(gl.capabilities.getMaxAnisotropy()), [gl])

  useEffect(() => {
    const env = applyStudioEnvironment(gl, scene)
    invalidate()
    return () => {
      scene.environment = null
      disposeStudioEnvironment?.(gl)
    }
  }, [gl, scene, invalidate])

  // Desperta a renderização quando running passa para true
  useEffect(() => {
    if (running) {
      invalidate()
    }
  }, [running, invalidate])

  const top = useRef()
  const ghosts = useMemo(() => Array.from({ length: copies - 1 }, () => ({})), [copies])
  const isSleeping = useRef(false)
  const smoothedP = useRef(typeof progress?.current === 'number' ? progress.current : 0)

  const wakeUp = () => {
    isSleeping.current = false
    invalidate()
  }

  useEffect(() => {
    window.addEventListener('scroll', wakeUp, { passive: true })
    window.addEventListener('resize', wakeUp, { passive: true })
    return () => {
      window.removeEventListener('scroll', wakeUp)
      window.removeEventListener('resize', wakeUp)
    }
  }, [])

  useFrame((_, rawDt) => {
    if (!running && !reduced) {
      isSleeping.current = true
      return
    }

    const dt = Math.min(rawDt, 0.05)
    const targetP = reduced ? 0.45 : (typeof progress?.current === 'number' ? progress.current : 0)
    const prevP = smoothedP.current
    smoothedP.current = THREE.MathUtils.damp(smoothedP.current, targetP, 5, dt)
    const p = smoothedP.current

    const open = smooth(clamp01((p - 0.04) / 0.5))
    const drift = (p - 0.5) * 0.75
    const [rx, ry, rz] = STACK.rot

    const g = top.current?.group
    if (g) {
      g.rotation.set(rx, ry, rz)
      g.position.set(0, drift * 0.3, 0)
    }

    ghosts.forEach((gh, i) => {
      if (!gh.group) return
      const n = i + 1
      const f = n * STACK.gap * (0.2 + 0.8 * open)
      gh.group.rotation.set(rx, ry, rz)
      gh.group.position.set(STACK.dir[0] * f, STACK.dir[1] * f + drift * 0.3, STACK.dir[2] * f)
      const a = Math.pow(1 - n / copies, 1.35) * 0.7 * open
      if (gh.mats) gh.mats.f.opacity = gh.mats.e.opacity = a
      gh.group.visible = a > 0.015
    })

    const delta = Math.abs(smoothedP.current - prevP)
    if (delta >= EPSILON) {
      invalidate()
    } else {
      isSleeping.current = true
    }
  })

  const baseScale = isSmallMobile ? 0.74 : isMobile ? 0.84 : 1
  const k = THREE.MathUtils.clamp((viewport.width / 6.8) * baseScale, 0.44, 1.05)

  return (
    <group scale={k} position={isMobile ? [0, 0.15, 0] : [-0.4, 0.45, 0]}>
      <NuCard ref={top} kit={kit} variant={0} />
      {ghosts.map((gh, i) => (
        <Ghost key={i} kit={kit} refObj={gh} index={i} total={copies - 1} />
      ))}
      <ambientLight intensity={0.35} color="#f6f2fc" />
      <directionalLight position={[3, 5, 5]} intensity={1.0} />
      {!isMobile && <directionalLight position={[-4, 1, -3]} intensity={0.65} color="#b98cff" />}
    </group>
  )
}

export default function StackScene({ progress, running, reduced, mobile }) {
  const isMobileHook = useIsMobile()
  const isSmallMobile = useIsSmallMobile()
  const isCoarse = useIsCoarsePointer()
  const isMobile = mobile ?? isMobileHook
  const copies = isMobile ? STACK.copiesMobile : STACK.copies

  return (
    <Canvas
      className="stack-canvas"
      style={{
        touchAction: 'pan-y',
        pointerEvents: isCoarse ? 'none' : 'auto',
      }}
      frameloop="demand"
      dpr={isMobile ? [1, 1.25] : [1, 1.75]}
      camera={{
        position: [0, 0, isSmallMobile ? 12.2 : isMobile ? 11.4 : 10.5],
        fov: 28,
        near: 0.5,
        far: 50,
      }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'pan-y'
        if (isCoarse) {
          gl.domElement.style.pointerEvents = 'none'
        }
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
      }}
      aria-label="Cascata tridimensional de cartões Nubank"
      role="img"
    >
      <Scene
        progress={progress}
        copies={copies}
        reduced={reduced}
        running={running}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
      />
    </Canvas>
  )
}
