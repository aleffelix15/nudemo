import { m } from 'framer-motion'
import { FAQ as FAQ_ITEMS } from '../content'
import Icon from './Icons'

export default function FAQ() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-head">
        <span className="faq-tag">Tire suas dúvidas</span>
        <h2 id="faq-title">Perguntas Frequentes</h2>
        <p className="lead">
          Entenda como funcionam nossos cartões, o rendimento da conta digital, as Caixinhas e os recursos de segurança exclusivos.
        </p>
      </div>

      <div className="faq-accordion" role="region" aria-label="Lista de perguntas frequentes">
        {FAQ_ITEMS.map((item, index) => (
          <m.details
            key={item.q}
            className="faq-item"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <summary className="faq-question">
              <span>{item.q}</span>
              <Icon name="chevron" size={18} className="faq-icon" />
            </summary>
            <div className="faq-answer">
              <p>{item.a}</p>
            </div>
          </m.details>
        ))}
      </div>
    </section>
  )
}
