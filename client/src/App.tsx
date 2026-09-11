import { useMemo } from 'react'
import { CategoryNav } from './components/CategoryNav'
import { CategorySection } from './components/CategorySection'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { useActiveSection } from './hooks/useActiveSection'
import { useMenu } from './hooks/useMenu'

export default function App() {
  const state = useMenu()
  const ids = useMemo(
    () => (state.status === 'ready' ? state.menu.categories.map((c) => c.id) : []),
    [state],
  )
  const activeId = useActiveSection(ids)

  if (state.status === 'loading') {
    return (
      <main className="status">
        <img src="/helmet.png" alt="" width="55" height="89" className="status__helmet" />
        <p>Preparando la carta…</p>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className="status">
        <p>No pudimos cargar la carta.</p>
        <p className="status__detail">{state.message}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </main>
    )
  }

  const { restaurant, categories } = state.menu

  return (
    <>
      <Hero restaurant={restaurant} />
      <CategoryNav categories={categories} activeId={activeId} />
      <main className="menu">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} currency={restaurant.currency} />
        ))}
      </main>
      <Footer name={restaurant.name} />
    </>
  )
}
