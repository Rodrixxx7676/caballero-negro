import { useEffect, useRef, useState, type FormEvent } from 'react'
import { fetchChatStatus, sendChat, type ChatMessage } from '../api/chat'

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: '¡Bienvenido a El Caballero Negro! Pregúntame por nuestras pastas, pizzas, precios o qué te recomendaría hoy.',
}

const SUGGESTIONS = ['¿Cuál es la especialidad de la casa?', '¿Qué pizzas tienen?', '¿Tienen opciones sin carne?']

export function ChatWidget() {
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Solo se muestra el botón si la API tiene el asistente configurado.
  useEffect(() => {
    const controller = new AbortController()
    fetchChatStatus(controller.signal).then(setAvailable)
    return () => controller.abort()
  }, [])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || busy) return
    const next: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setError(null)
    setBusy(true)
    try {
      // El saludo inicial es solo de interfaz; al modelo van los turnos reales.
      const reply = await sendChat(next.filter((m) => m !== WELCOME))
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pude responder en este momento.')
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  if (!available) return null

  return (
    <>
      <button
        type="button"
        className={`chat-fab${open ? ' chat-fab--hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente de la carta"
      >
        <img src="/helmet.png" alt="" width="22" height="36" />
        <span>Pregúntale al Caballero</span>
      </button>

      {open && (
        <section className="chat" role="dialog" aria-label="Asistente de la carta">
          <header className="chat__header">
            <img src="/helmet.png" alt="" width="20" height="32" />
            <div>
              <strong>El Caballero</strong>
              <small>Asistente de la carta</small>
            </div>
            <button type="button" className="chat__close" onClick={() => setOpen(false)} aria-label="Cerrar">
              ×
            </button>
          </header>

          <div ref={logRef} className="chat__log">
            {messages.map((m, i) => (
              <p key={i} className={`chat__bubble chat__bubble--${m.role}`}>
                {m.content}
              </p>
            ))}
            {busy && (
              <p className="chat__bubble chat__bubble--assistant chat__bubble--typing" aria-live="polite">
                <span />
                <span />
                <span />
              </p>
            )}
            {error && <p className="chat__error">{error}</p>}
          </div>

          {messages.length === 1 && (
            <div className="chat__suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => void send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="chat__form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              maxLength={600}
              autoComplete="off"
              disabled={busy}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar">
              ➤
            </button>
          </form>
        </section>
      )}
    </>
  )
}
