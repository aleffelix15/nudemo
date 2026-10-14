import { FOOTER } from '../content'
import { NuLogo } from './Icons'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-brand">
          <NuLogo size={42} color="var(--nu)" title="Nubank" />
        </div>
        <nav className="footer-cols" aria-label="Rodapé">
          {FOOTER.columns.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#topo" onClick={(e) => e.preventDefault()}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">
          {FOOTER.disclaimer}
        </p>
        <p className="footer-legal">{FOOTER.legal}</p>
      </div>
    </footer>
  )
}
