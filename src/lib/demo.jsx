import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const Ctx = createContext(() => {})
export const useDemo = () => useContext(Ctx)

// Diálogo nativo: foco preso, Esc fecha, devolve o foco ao botão de origem.
export function DemoProvider({ children }) {
  const ref = useRef(null)
  const origin = useRef(null)
  const [msg, setMsg] = useState({ title: '', text: '' })

  const open = useCallback((title, text) => {
    origin.current = document.activeElement
    setMsg({
      title: title || 'Este é um site demonstrativo',
      text: text || 'Nenhuma conta é aberta e nenhum dado é coletado aqui.',
    })
  }, [])

  useEffect(() => {
    if (msg.title && ref.current && !ref.current.open) ref.current.showModal()
  }, [msg])

  const close = () => {
    ref.current?.close()
    origin.current?.focus?.()
  }

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        className="demo-dialog"
        onClose={() => setMsg({ title: '', text: '' })}
        onClick={(e) => e.target === ref.current && close()}
        aria-labelledby="demo-title"
      >
        <h2 id="demo-title">{msg.title}</h2>
        <p>{msg.text}</p>
        <button type="button" className="btn btn-dark" onClick={close} autoFocus>
          Entendi
        </button>
      </dialog>
    </Ctx.Provider>
  )
}
