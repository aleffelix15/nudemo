import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TRACK } from '../content'
import Phone from './Phone'
import { useDemo } from '../lib/demo'
import { useReducedMotionMQ } from '../three/hooks'

const GHOSTS = 7

// Camadas atrás do celular: abrem conforme a seção cruza a tela (efeito de eco da referência)
function Trail({ progress, reduced }) {
  const spread = useTransform(progress, [0.05, 0.55], [0.15, 1])
  return (
    <>
      {Array.from({ length: GHOSTS }, (_, i) => (
        <Ghost key={i} i={i + 1} spread={spread} reduced={reduced} />
      ))}
    </>
  )
}
function Ghost({ i, spread, reduced }) {
  const x = useTransform(spread, (s) => -i * 15 * (reduced ? 1 : s))
  const y = useTransform(spread, (s) => i * 11 * (reduced ? 1 : s))
  return <motion.span className="ghost" style={{ x, y, opacity: 0.42 - i * 0.05 }} aria-hidden="true" />
}

export default function Track() {
  const demo = useDemo()
  const ref = useRef(null)
  const reduced = useReducedMotionMQ()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [6, -8])
  const lift = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section className="track" id="conta" ref={ref}>
      <div className="track-device">
        <motion.div className="track-phone" style={reduced ? { rotate: -4 } : { rotate, y: lift }}>
          <Trail progress={scrollYProgress} reduced={reduced} />
          <Phone screen="dark" dark alt="Tela inicial do aplicativo Nubank em Modo Escuro" />
        </motion.div>
      </div>
      <div className="track-copy">
        <h2>
          {TRACK.title[0]}
          <br />
          <span className="accent">{TRACK.title[1]}</span>
        </h2>
        <p className="lead">{TRACK.lead}</p>
        <ul className="ticks">
          {TRACK.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button type="button" className="btn btn-primary" onClick={() => demo()}>
          {TRACK.action}
        </button>
      </div>
    </section>
  )
}
