import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CategoryNav } from '../components/CategoryNav'
import { CategorySection } from '../components/CategorySection'
import { Hero } from '../components/Hero'
import { Status } from '../components/Status'
import { useActiveSection } from '../hooks/useActiveSection'
import { useMenu } from '../hooks/useMenu'

export function MenuPage() {
  const state = useMenu()
  const { hash } = useLocation()
  const ids = useMemo(
    () => (state.status === 'ready' ? state.menu.categories.map((c) => c.id) : []),
    [state],
  )
  const activeId = useActiveSection(ids)

  // Al llegar con #pizzas (por ejemplo desde /nosotros), la carta aún no existía: desplazamos al cargar.
  useEffect(() => {
    if (state.status !== 'ready' || !hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
  }, [state.status, hash])

  if (state.status === 'loading') return <Status message="Preparando la carta…" />
  if (state.status === 'error') return <Status message={state.message} error />

  const { restaurant, categories } = state.menu

  return (
    <>
      <Hero restaurant={restaurant} />
      <CategoryNav categories={categories} activeId={activeId} />
      <main className="menu container">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} currency={restaurant.currency} />
        ))}
      </main>
    </>
  )
}
