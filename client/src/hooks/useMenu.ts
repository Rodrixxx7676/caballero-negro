import { useEffect, useState } from 'react'
import { fetchMenu } from '../api/menu'
import type { Menu } from '../types/menu'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; menu: Menu }

export function useMenu(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetchMenu(controller.signal)
      .then((menu) => setState({ status: 'ready', menu }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Error desconocido.'
        setState({ status: 'error', message })
      })
    return () => controller.abort()
  }, [])

  return state
}
