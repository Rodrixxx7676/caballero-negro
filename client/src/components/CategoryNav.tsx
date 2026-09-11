import { useEffect, useRef } from 'react'
import type { Category } from '../types/menu'

interface Props {
  categories: Category[]
  activeId: string | null
}

export function CategoryNav({ categories, activeId }: Props) {
  const navRef = useRef<HTMLElement>(null)

  // Mantiene la pestaña activa visible cuando la barra se desplaza en horizontal (móvil).
  useEffect(() => {
    if (!activeId || !navRef.current) return
    const link = navRef.current.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)
    link?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeId])

  return (
    <nav ref={navRef} className="nav" aria-label="Categorías de la carta">
      <img src="/helmet.png" alt="" className="nav__helmet" width="28" height="45" />
      <ul className="nav__list">
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={`nav__link${c.id === activeId ? ' nav__link--active' : ''}`}
              aria-current={c.id === activeId ? 'location' : undefined}
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
