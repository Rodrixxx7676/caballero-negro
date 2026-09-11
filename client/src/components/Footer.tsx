interface Props {
  name: string
}

export function Footer({ name }: Props) {
  return (
    <footer className="footer">
      <span className="ornament" aria-hidden="true" />
      <p>
        {name} · Villa El Salvador, Lima
      </p>
      <p className="footer__small">Precios en soles (S/.). Carta sujeta a disponibilidad.</p>
    </footer>
  )
}
