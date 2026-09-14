interface Props {
  eyebrow?: string
  title: string
  lead?: string
}

/** Cabecera de las páginas interiores (Nosotros, Ubicación, Contacto). */
export function PageHeader({ eyebrow, title, lead }: Props) {
  return (
    <header className="page-header">
      <img src="/helmet.png" alt="" width="48" height="78" className="page-header__helmet" />
      {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
      <h1 className="page-header__title">{title}</h1>
      <span className="ornament" aria-hidden="true" />
      {lead && <p className="page-header__lead">{lead}</p>}
    </header>
  )
}
