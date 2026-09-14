import CardNav, { type CardNavItem } from './CardNav/CardNav'

/**
 * Menú principal del sitio (React Bits · Card Nav).
 * Las rutas /nosotros, /ubicacion y /contacto son la fase 2; hoy solo existe la carta.
 */
const items: CardNavItem[] = [
  {
    label: 'Nosotros',
    bgColor: '#141414',
    textColor: '#ffffff',
    links: [
      { label: 'Nuestra historia', href: '/nosotros', ariaLabel: 'Conoce nuestra historia' },
      { label: 'Ubicación', href: '/ubicacion', ariaLabel: 'Cómo llegar al restaurante' },
    ],
  },
  {
    label: 'Carta',
    bgColor: '#1c1c1c',
    textColor: '#ffffff',
    links: [
      { label: 'Pastas', href: '#pastas-especiales', ariaLabel: 'Ver pastas' },
      { label: 'Pizzas', href: '#pizzas', ariaLabel: 'Ver pizzas' },
      { label: 'Bebidas', href: '#la-taberna-del-caballero', ariaLabel: 'Ver bebidas' },
    ],
  },
  {
    label: 'Contacto',
    bgColor: '#c8892b',
    textColor: '#000000',
    links: [
      { label: 'WhatsApp', href: '/contacto', ariaLabel: 'Escríbenos por WhatsApp' },
      { label: 'Instagram', href: '/contacto', ariaLabel: 'Síguenos en Instagram' },
      { label: 'Facebook', href: '/contacto', ariaLabel: 'Síguenos en Facebook' },
    ],
  },
]

export function SiteNav() {
  return (
    <CardNav
      logo="/helmet.png"
      logoAlt="El Caballero Negro"
      items={items}
      baseColor="#0a0a0a"
      menuColor="#ffffff"
      buttonBgColor="#c8892b"
      buttonTextColor="#000000"
      ctaLabel="Ver carta"
      ctaHref="#entrantes"
      ease="power3.out"
    />
  )
}
