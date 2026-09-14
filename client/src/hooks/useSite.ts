import { useEffect, useState } from 'react'
import { fetchSite } from '../api/site'
import type { Site } from '../types/site'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; site: Site }

export function useSite(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetchSite(controller.signal)
      .then((site) => setState({ status: 'ready', site }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Error desconocido.' })
      })
    return () => controller.abort()
  }, [])

  return state
}
