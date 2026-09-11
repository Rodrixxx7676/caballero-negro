/** Contrato de GET /api/menu — espejo de Models/Menu.cs en la API. */

export interface Menu {
  restaurant: Restaurant
  categories: Category[]
}

export interface Restaurant {
  name: string
  tagline: string
  welcome: string
  description: string[]
  currency: string
}

export interface Category {
  id: string
  name: string
  items: MenuItem[]
  /** Solo bebidas: subgrupos con sus propios productos. */
  groups?: ItemGroup[]
  /** Solo pizzas: nombres de las columnas de precio. */
  sizes?: string[]
  notes?: string[]
  intro?: string[]
  note?: CategoryNote
}

export interface ItemGroup {
  name: string
  items: MenuItem[]
  note?: string
}

export interface CategoryNote {
  title: string
  options: string[]
}

export interface MenuItem {
  id: string
  name: string
  price?: number
  prices?: Record<string, number>
  description?: string
  subtitle?: string
  highlight?: boolean
}
