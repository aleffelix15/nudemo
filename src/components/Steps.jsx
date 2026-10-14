import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { STEPS } from '../content'

// Linha central que se preenche com o scroll; cada passo acende ao ser alcançado
export default function Steps() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const h = useTransform(fill, (v) => `${v * 100}%`)
  const [on, setOn] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setOn(STEPS.filter((_, i) => v >= (i + 0.35) / STEPS.length).length))

  return (
    <section className="steps" ref={ref} aria-label="Como começar">
      <div className="steps-line" aria-hidden="true">
        <motion.i style={{ height: h }} />
      </div>
      <ol>
        {STEPS.map((s, i) => (
          <li key={s.title} className={`${i % 2 ? 'right' : 'left'} ${i < on ? 'on' : ''}`}>
            <span className="dot" aria-hidden="true" />
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
