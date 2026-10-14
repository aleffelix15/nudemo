import { useState } from 'react'
import { motion } from 'framer-motion'
import { APP } from '../content'
import Phone from './Phone'
import { useDemo } from '../lib/demo'

const SLOTS = [
  { cls: 'c1', from: -30 },
  { cls: 'c2', from: 30 },
  { cls: 'c3', from: -30 },
  { cls: 'c4', from: 30 },
]

export default function AppSection() {
  const demo = useDemo()
  const [activeTab, setActiveTab] = useState('conta') // 'conta' | 'cartao' | 'caixinhas'

  return (
    <section className="appsec" id="app" aria-label="Aplicativo Nubank">
      <div className="app-device">
        {/* Seletor interativo que altera estados reais dentro do celular */}
        <div className="app-mode-selector" role="tablist" aria-label="Visualização da experiência">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'conta'}
            className={`app-mode-tab ${activeTab === 'conta' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('conta')}
          >
            Conta & Pix
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cartao'}
            className={`app-mode-tab ${activeTab === 'cartao' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('cartao')}
          >
            Cartão & Fatura
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'caixinhas'}
            className={`app-mode-tab ${activeTab === 'caixinhas' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('caixinhas')}
          >
            Caixinhas & Limite
          </button>
        </div>

        <div className="app-phone-wrapper">
          <Phone
            activeTab={activeTab}
            onTabChange={setActiveTab}
            alt="Interface nativa 100% vetorial e nítida do aplicativo Nubank"
          />
        </div>

        {APP.chips.map((c, i) => (
          <motion.div
            key={c.title}
            className={`chip-note ${SLOTS[i].cls}`}
            initial={{ opacity: 0, x: SLOTS[i].from }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <b>{c.title}</b>
            <span>{c.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="app-copy">
        <h2>
          {APP.title[0]} <span className="accent">{APP.title[1]}</span>
        </h2>
        <p className="lead">{APP.lead}</p>
        <div className="stores">
          {APP.stores.map((s) => (
            <button
              key={s.name}
              type="button"
              className="store"
              aria-label={`Baixar na loja ${s.name}`}
              onClick={() =>
                demo(`${s.name}`, 'Este é um site demonstrativo. O app não está disponível para download aqui.')
              }
            >
              <small>{s.small}</small>
              <b>{s.name}</b>
            </button>
          ))}
        </div>
        <p className="note">{APP.note}</p>
      </div>
    </section>
  )
}
