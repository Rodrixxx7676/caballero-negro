import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import type { Site } from '../types/site'

interface Props {
  site: Site
}

export function AboutPage({ site }: Props) {
  return (
    <main className="page container">
      <PageHeader eyebrow="Nosotros" title="Nuestra historia" lead={site.slogan} />

      <article className="story">
        {site.story.map((paragraph, i) => (
          <p key={i} className={i === 0 ? 'story__lead' : undefined}>
            {paragraph}
          </p>
        ))}
      </article>

      <section className="values" aria-label="Lo que nos define">
        {site.values.map((v) => (
          <div key={v.title} className="values__card">
            <h2>{v.title}</h2>
            <p>{v.text}</p>
          </div>
        ))}
      </section>

      <p className="page__cta">
        <Link to="/" className="button">Ver la carta</Link>
        <Link to="/ubicacion" className="button button--ghost">Cómo llegar</Link>
      </p>
    </main>
  )
}
