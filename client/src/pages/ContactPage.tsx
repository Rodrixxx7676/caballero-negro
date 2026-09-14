import { FaFacebook, FaInstagram, FaPhone, FaTiktok, FaWhatsapp } from 'react-icons/fa6'
import { socialLinks } from '../api/site'
import { PageHeader } from '../components/PageHeader'
import type { Site } from '../types/site'

interface Props {
  site: Site
}

export function ContactPage({ site }: Props) {
  const links = socialLinks(site)
  const { contact } = site

  const channels = [
    { icon: <FaWhatsapp />, label: 'WhatsApp', detail: `+${contact.whatsapp.slice(0, 2)} ${contact.phones[0]}`, href: links.whatsapp, primary: true },
    { icon: <FaInstagram />, label: 'Instagram', detail: `@${contact.instagram}`, href: links.instagram },
    { icon: <FaFacebook />, label: 'Facebook', detail: contact.facebook, href: links.facebook },
    { icon: <FaTiktok />, label: 'TikTok', detail: `@${contact.tiktok}`, href: links.tiktok },
  ]

  return (
    <main className="page container">
      <PageHeader
        eyebrow="Contacto"
        title="Escríbenos"
        lead="Reservas, pedidos para eventos o cualquier consulta: síguenos y escríbenos por donde prefieras."
      />

      <ul className="channels">
        {channels.map((c) => (
          <li key={c.label}>
            <a
              className={`channel${c.primary ? ' channel--primary' : ''}`}
              href={c.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="channel__icon" aria-hidden="true">{c.icon}</span>
              <span className="channel__text">
                <strong>{c.label}</strong>
                <small>{c.detail}</small>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section className="phones" aria-label="Teléfonos">
        <h2 className="group__title">Llámanos</h2>
        <p>
          {contact.phones.map((p) => (
            <a key={p} className="phones__link" href={links.phone(p)}>
              <FaPhone aria-hidden="true" /> {p}
            </a>
          ))}
        </p>
      </section>
    </main>
  )
}
