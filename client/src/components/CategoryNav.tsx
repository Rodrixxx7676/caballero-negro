import { useEffect, useRef } from 'react'
import type { Category } from '../types/menu'

interface Props {
  categories: Category[]
  activeId: string | null
}

export function CategoryNav({ categories, activeId }: Props) {
  const listRef = useRef<HTMLUListElement>(null)

  // Centra la pestaña activa desplazando SOLO la lista en horizontal.
  // (scrollIntoView movería también la página y se pelearía con el scroll del usuario.)
  useEffect(() => {
    const list = listRef.current
    if (!activeId || !list) return
    const link = list.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)
    if (!link) return
    const target = link.offsetLeft + link.offsetWidth / 2 - list.clientWidth / 2
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [activeId])

  return (
    <nav className="nav" aria-label="Categorías de la carta">
      <div className="nav__inner container">
        <img src="/helmet.png" alt="" className="nav__helmet" width="28" height="45" />
        <ul ref={listRef} className="nav__list">
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
      </div>
    </nav>
  )
}
