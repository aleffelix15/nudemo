import { useState } from 'react'
import { m } from 'framer-motion'
import { APP } from '../content'
import Phone from './Phone'
import { useDemo } from '../lib/demo'

const SLOTS = [
  { cls: 'c1', from: -30 },
  { cls: 'c2', from: 30 },
  { cls: 'c3', from: -30 },
  { cls: 'c4', from: 30 },
]

const TABS = [
  { id: 'conta', label: 'Conta & Pix' },
  { id: 'cartao', label: 'Cartão & Fatura' },
  { id: 'caixinhas', label: 'Caixinhas & Limite' },
]

export default function AppSection() {
  const demo = useDemo()
  const [activeTab, setActiveTab] = useState('conta') // 'conta' | 'cartao' | 'caixinhas'

  const handleTabKeyDown = (e, currentId) => {
    const idx = TABS.findIndex((t) => t.id === currentId)
    let nextIdx = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = (idx + 1) % TABS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = (idx - 1 + TABS.length) % TABS.length
    } else if (e.key === 'Home') {
      nextIdx = 0
    } else if (e.key === 'End') {
      nextIdx = TABS.length - 1
    }
    if (nextIdx !== null) {
      e.preventDefault()
      const nextTab = TABS[nextIdx]
      setActiveTab(nextTab.id)
      document.getElementById(`app-tab-${nextTab.id}`)?.focus()
    }
  }

  return (
    <section className="appsec" id="app" aria-label="Aplicativo Nubank">
      <div className="app-device">
        {/* Seletor interativo que altera estados reais dentro do celular */}
        <div className="app-mode-selector" role="tablist" aria-label="Visualização da experiência">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                id={`app-tab-${tab.id}`}
                type="button"
                role="tab"
                tabIndex={isSelected ? 0 : -1}
                aria-selected={isSelected}
                aria-controls={`app-panel-${tab.id}`}
                className={`app-mode-tab ${isSelected ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div
          className="app-phone-wrapper"
          id={`app-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`app-tab-${activeTab}`}
        >
          <Phone
            activeTab={activeTab}
            onTabChange={setActiveTab}
            alt="Interface nativa 100% vetorial e nítida do aplicativo Nubank"
          />
        </div>

        {APP.chips.map((c, i) => (
          <m.div
            key={c.title}
            className={`chip-note ${SLOTS[i].cls}`}
            initial={{ opacity: 0, x: SLOTS[i].from }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <b>{c.title}</b>
            <span>{c.text}</span>
          </m.div>
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
