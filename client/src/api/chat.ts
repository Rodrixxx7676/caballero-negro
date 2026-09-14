export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function fetchChatStatus(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch('/api/chat/status', { signal })
    if (!res.ok) return false
    const data: { available: boolean } = await res.json()
    return data.available
  } catch {
    return false
  }
}

export async function sendChat(messages: ChatMessage[], signal?: AbortSignal): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  if (res.status === 429) throw new Error('Vas muy rápido. Espera un momento e inténtalo de nuevo.')
  if (!res.ok) {
    const data: { message?: string } = await res.json().catch(() => ({}))
    throw new Error(data.message ?? 'No pude responder en este momento.')
  }
  const data: { reply: string } = await res.json()
  return data.reply
}
