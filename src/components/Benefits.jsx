import { m } from 'framer-motion'
import { BENEFITS, MARQUEE } from '../content'
import Icon from './Icons'

export default function Benefits() {
  return (
    <section className="benefits" id="vantagens" aria-label="Vantagens e Benefícios">
      <div className="head dark">
        <h2>
          {BENEFITS.title[0]}
          <br />
          <span className="accent">{BENEFITS.title[1]}</span>
        </h2>
        <p>{BENEFITS.lead}</p>
      </div>

      <ul className="benefit-grid" role="list">
        {BENEFITS.items.map((b, i) => (
          <m.li
            key={b.title}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Icon name={b.icon} size={22} />
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </m.li>
        ))}
      </ul>

      <div className="marquee" role="region" aria-label={MARQUEE.title}>
        <p>{MARQUEE.title}</p>
        <div className="marquee-row" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} className="marquee-set">
                {MARQUEE.items.map((m) => (
                  <b key={m + k}>{m}</b>
                ))}
              </span>
            ))}
          </div>
        </div>
        <ul className="sr-only">
          {MARQUEE.items.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
