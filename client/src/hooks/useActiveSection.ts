import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección visible más cercana al borde superior,
 * para marcar la categoría activa en la navegación.
 * Se evalúa como máximo una vez por frame para no frenar el scroll.
 */
export function useActiveSection(ids: string[], offset = 120): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    let frame = 0

    const evaluate = () => {
      frame = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(evaluate)
    }

    evaluate()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids, offset])

  return active
}
