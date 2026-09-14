import { socialLinks } from '../api/site'
import type { Site } from '../types/site'
import CardNav, { type CardNavItem } from './CardNav/CardNav'

interface Props {
  site: Site
}

/** Menú principal del sitio (React Bits · Card Nav). */
export function SiteNav({ site }: Props) {
  const links = socialLinks(site)

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
        { label: 'Pastas', href: '/#pastas-especiales', ariaLabel: 'Ver pastas' },
        { label: 'Pizzas', href: '/#pizzas', ariaLabel: 'Ver pizzas' },
        { label: 'Bebidas', href: '/#la-taberna-del-caballero', ariaLabel: 'Ver bebidas' },
      ],
    },
    {
      label: 'Contacto',
      bgColor: '#c8892b',
      textColor: '#000000',
      links: [
        { label: 'WhatsApp', href: links.whatsapp, ariaLabel: 'Escríbenos por WhatsApp' },
        { label: 'Instagram', href: links.instagram, ariaLabel: 'Síguenos en Instagram' },
        { label: 'Facebook', href: links.facebook, ariaLabel: 'Síguenos en Facebook' },
      ],
    },
  ]

  return (
    <CardNav
      logo="/helmet.png"
      logoAlt={site.name}
      items={items}
      baseColor="#0a0a0a"
      menuColor="#ffffff"
      buttonBgColor="#c8892b"
      buttonTextColor="#000000"
      ctaLabel="Ver carta"
      ctaHref="/"
      ease="power3.out"
    />
  )
}
