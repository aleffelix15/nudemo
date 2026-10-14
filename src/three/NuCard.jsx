import { forwardRef, useImperativeHandle, useRef } from 'react'
import { CARD_FACE_Z } from './cardGeometry'
import { CHIP_POS } from './cardKit'

const BACK_Z = -CARD_FACE_Z

// Cartão 3D de alta precisão: corpo plástico/metálico, frente impressa, chip metálico EMV e verso com tarja.
const NuCard = forwardRef(function NuCard({ kit, variant = 0 }, ref) {
  const group = useRef()
  const slab = useRef()
  const front = useRef()
  const back = useRef()

  const apply = (i) => {
    const v = kit.variants[i]
    if (slab.current) slab.current.material = v.edge
    if (front.current) front.current.material = v.front
    if (back.current) back.current.material = v.back
  }

  useImperativeHandle(ref, () => ({ group: group.current, setVariant: apply }), [kit])

  const v0 = kit.variants[variant]
  return (
    <group ref={group}>
      <mesh
        ref={slab}
        geometry={kit.slab}
        material={v0.edge}
        matrixAutoUpdate={false}
        onUpdate={(self) => self.updateMatrix()}
      />
      <mesh
        ref={front}
        geometry={kit.face}
        material={v0.front}
        position={[0, 0, CARD_FACE_Z + 0.0003]}
        matrixAutoUpdate={false}
        onUpdate={(self) => self.updateMatrix()}
      />
      <mesh
        geometry={kit.chipGeo}
        material={kit.chipMat}
        position={[CHIP_POS.x, CHIP_POS.y, CARD_FACE_Z + 0.0015]}
        matrixAutoUpdate={false}
        onUpdate={(self) => self.updateMatrix()}
      />
      <mesh
        ref={back}
        geometry={kit.face}
        material={v0.back}
        position={[0, 0, BACK_Z - 0.0003]}
        rotation={[0, Math.PI, 0]}
        matrixAutoUpdate={false}
        onUpdate={(self) => self.updateMatrix()}
      />
    </group>
  )
})

export default NuCard
