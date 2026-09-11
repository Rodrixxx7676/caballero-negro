import type { Restaurant } from '../types/menu'

interface Props {
  restaurant: Restaurant
}

export function Hero({ restaurant }: Props) {
  return (
    <header className="hero">
      <img src="/helmet.png" alt="" className="hero__helmet" width="72" height="117" />
      <p className="hero__tagline">{restaurant.tagline}</p>
      <h1 className="hero__name">{restaurant.name}</h1>
      <span className="ornament" aria-hidden="true" />
      <div className="hero__description">
        {restaurant.description.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="hero__welcome">{restaurant.welcome}</p>
    </header>
  )
}
