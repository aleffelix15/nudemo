import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import NuCard from './NuCard'
import { createCardKit } from './cardKit'
import { applyStudioEnvironment } from './stage'
import { STACK, smooth, clamp01 } from './motion'
import { CARD_FACE_Z } from './cardGeometry'

function Ghost({ kit, refObj }) {
  // Cópias fantasma simplificadas para performance e estética clean
  const mats = useMemo(() => {
    const f = new THREE.MeshStandardMaterial({
      color: '#6509a7',
      metalness: 0.1,
      roughness: 0.38,
      transparent: true,
      depthWrite: false,
    })
    const e = new THREE.MeshStandardMaterial({
      color: '#4e0480',
      metalness: 0.1,
      roughness: 0.42,
      transparent: true,
      depthWrite: false,
    })
    return { f, e }
  }, [])

  useEffect(() => () => {
    mats.f.dispose()
    mats.e.dispose()
  }, [mats])

  useEffect(() => {
    refObj.mats = mats
  }, [mats, refObj])

  return (
    <group ref={(g) => (refObj.group = g)}>
      <mesh geometry={kit.slab} material={mats.e} />
      <mesh geometry={kit.face} material={mats.f} position={[0, 0, CARD_FACE_Z + 0.0003]} />
    </group>
  )
}

function Scene({ progress, copies, reduced }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)
  const viewport = useThree((s) => s.viewport)

  const kit = useMemo(() => createCardKit(gl.capabilities.getMaxAnisotropy()), [gl])
  useEffect(() => () => kit.dispose(), [kit])

  useEffect(() => {
    const env = applyStudioEnvironment(gl, scene)
    invalidate()
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [gl, scene, invalidate])

  const top = useRef()
  const ghosts = useMemo(() => Array.from({ length: copies - 1 }, () => ({})), [copies])

  useFrame(() => {
    const p = reduced ? 0.45 : progress.current
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
      const a = Math.pow(1 - n / copies, 1.25) * 0.65 * open
      if (gh.mats) gh.mats.f.opacity = gh.mats.e.opacity = a
      gh.group.visible = a > 0.01
    })
  })

  const k = THREE.MathUtils.clamp(viewport.width / 6.8, 0.58, 1.05)

  return (
    <group scale={k} position={[-0.4, 0.45, 0]}>
      <NuCard ref={top} kit={kit} variant={0} />
      {ghosts.map((gh, i) => (
        <Ghost key={i} kit={kit} refObj={gh} />
      ))}
      <ambientLight intensity={0.4} color="#f6f2fc" />
      <directionalLight position={[3, 5, 5]} intensity={1.1} />
      <directionalLight position={[-4, 1, -3]} intensity={0.7} color="#b98cff" />
    </group>
  )
}

export default function StackScene({ progress, running, reduced, mobile }) {
  const copies = mobile ? STACK.copiesMobile : STACK.copies
  return (
    <Canvas
      className="stack-canvas"
      frameloop={running && !reduced ? 'always' : 'demand'}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10.5], fov: 28, near: 0.5, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      aria-label="Cascata tridimensional de cartões Nubank"
      role="img"
    >
      <Scene progress={progress} copies={copies} reduced={reduced} />
    </Canvas>
  )
}
