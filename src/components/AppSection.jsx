import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [activeTab, setActiveTab] = useState('dark') // 'dark' | 'ecosystem'

  return (
    <section className="appsec" id="app" aria-label="Aplicativo Nubank">
      <div className="app-device">
        {/* Seletor estilizado em pílula para alternar entre experiências */}
        <div className="app-mode-selector" role="tablist" aria-label="Visualização da experiência">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'dark'}
            className={`app-mode-tab ${activeTab === 'dark' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('dark')}
          >
            Modo Escuro (App)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'image'}
            className={`app-mode-tab ${activeTab === 'image' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            Captura Real
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ecosystem'}
            className={`app-mode-tab ${activeTab === 'ecosystem' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('ecosystem')}
          >
            Conta & Cartão
          </button>
        </div>

        <div className="app-phone-wrapper">
          <div
            className={`app-view-pane ${activeTab === 'dark' ? 'is-active' : ''}`}
            aria-hidden={activeTab !== 'dark'}
          >
            <Phone
              screen="dark"
              alt="Interface nativa em alta nitidez do aplicativo Nubank em Modo Escuro"
            />
          </div>
          <div
            className={`app-view-pane ${activeTab === 'image' ? 'is-active' : ''}`}
            aria-hidden={activeTab !== 'image'}
          >
            <Phone
              screen="image"
              alt="Captura de tela real do aplicativo Nubank em Modo Escuro"
            />
          </div>
          <div
            className={`app-view-pane ${activeTab === 'ecosystem' ? 'is-active' : ''}`}
            aria-hidden={activeTab !== 'ecosystem'}
          >
            <div className="editorial-eco-card">
              <div className="editorial-badge">Ecossistema Integrado</div>
              <div className="editorial-img-frame">
                <img
                  src="/assets/app-light-and-card-ref.jpg"
                  alt="Ecossistema Nubank com smartphone e cartão de crédito vertical"
                  width="447"
                  height="447"
                  className="editorial-eco-img"
                  decoding="async"
                />
              </div>
              <div className="editorial-caption">
                <span>Conta Digital e Cartão Físico com Chip EMV</span>
              </div>
            </div>
          </div>
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
