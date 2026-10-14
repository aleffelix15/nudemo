import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NAV } from '../content'
import Icon, { NuLogo } from './Icons'
import { useDemo } from '../lib/demo'

export default function Header() {
  const demo = useDemo()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (vis) setActive(vis.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.1, 0.5] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="header">
      <nav className="pill" aria-label="Principal">
        <a href="#topo" className="pill-logo" aria-label="Início">
          <NuLogo size={30} color="var(--nu)" />
        </a>

        <ul className="pill-links">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
                {active === n.id && <motion.span layoutId="nav-active" className="pill-active" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                <span>{n.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="pill-actions">
          <button type="button" className="pill-text" onClick={() => demo('Acessar conta', 'O acesso à conta não existe neste site demonstrativo.')}>
            Acessar
          </button>
          <button type="button" className="btn btn-dark btn-sm" onClick={() => demo()}>
            Abrir conta
          </button>
          <button
            type="button"
            className="pill-menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label="Menu principal"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="sheet" id="menu-mobile">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
                const el = document.getElementById(n.id)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {n.label}
            </a>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setOpen(false)
              demo('Abrir conta', 'Demonstração de abertura de conta digital.')
            }}
          >
            Abrir conta
          </button>
        </div>
      )}
    </header>
  )
}
