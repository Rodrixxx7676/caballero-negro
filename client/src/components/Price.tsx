interface Props {
  currency: string
  value: number
}

export function Price({ currency, value }: Props) {
  return (
    <span className="price">
      <span className="price__currency">{currency}</span>
      {value}
    </span>
  )
}
