import { Link } from 'react-router-dom'
import { socialLinks } from '../api/site'
import type { Site } from '../types/site'

interface Props {
  site: Site
}

export function Footer({ site }: Props) {
  const links = socialLinks(site)
  return (
    <footer className="footer container">
      <span className="ornament" aria-hidden="true" />
      <nav className="footer__nav" aria-label="Secciones">
        <Link to="/">Carta</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/ubicacion">Ubicación</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>
      <p className="footer__social">
        <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <a href={links.facebook} target="_blank" rel="noreferrer">Facebook</a>
        <a href={links.tiktok} target="_blank" rel="noreferrer">TikTok</a>
        <a href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
      </p>
      <p>
        {site.name} · {site.location.address} · {site.location.district}
      </p>
      <p className="footer__small">Precios en soles (S/.). Carta sujeta a disponibilidad.</p>
    </footer>
  )
}
