import type { Menu } from '../types/menu'

export async function fetchMenu(signal?: AbortSignal): Promise<Menu> {
  const res = await fetch('/api/menu', { signal })
  if (!res.ok) {
    throw new Error(`No se pudo cargar la carta (HTTP ${res.status}).`)
  }
  return res.json()
}
