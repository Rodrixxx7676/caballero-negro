import { socialLinks } from '../api/site'
import { PageHeader } from '../components/PageHeader'
import type { Site } from '../types/site'

interface Props {
  site: Site
}

export function LocationPage({ site }: Props) {
  const links = socialLinks(site)
  const { location } = site

  return (
    <main className="page container">
      <PageHeader eyebrow="Ubicación" title="Cómo llegar" lead={location.district} />

      <div className="location">
        <div className="location__info">
          <h2 className="group__title">Dirección</h2>
          <p className="location__address">{location.address}</p>
          <p className="location__muted">{location.district} · {location.reference}</p>

          <h2 className="group__title">Horario</h2>
          <ul className="location__hours">
            {location.hours.map((h) => (
              <li key={h.days}>
                <span>{h.days}</span>
                <span className="item__leader" aria-hidden="true" />
                <span>{h.open} – {h.close}</span>
              </li>
            ))}
          </ul>

          <h2 className="group__title">Referencias</h2>
          <ul className="location__directions">
            {location.directions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <p className="page__cta page__cta--left">
            <a className="button" href={links.map} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
            <a className="button button--ghost" href={links.whatsapp} target="_blank" rel="noreferrer">Reservar por WhatsApp</a>
          </p>
        </div>

        <div className="location__map">
          <iframe
            title={`Mapa de ${site.name}`}
            src={links.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </main>
  )
}
