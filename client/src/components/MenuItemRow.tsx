import type { MenuItem } from '../types/menu'
import { Price } from './Price'

interface Props {
  item: MenuItem
  currency: string
  /** Columnas de precio cuando el producto tiene varios tamaños (pizzas). */
  sizes?: string[]
}

export function MenuItemRow({ item, currency, sizes }: Props) {
  return (
    <li className={`item${item.highlight ? ' item--highlight' : ''}`}>
      <div className="item__head">
        <h4 className="item__name">
          <span className="item__label">{item.name}</span>
          {item.subtitle && <span className="item__subtitle">{item.subtitle}</span>}
        </h4>
        <span className="item__leader" aria-hidden="true" />
        {item.price !== undefined && <Price currency={currency} value={item.price} />}
        {item.prices && sizes && (
          <span className="item__prices">
            {sizes.map((size) => (
              <span key={size} className="item__price-cell">
                <span className="item__size">{size}</span>
                <Price currency={currency} value={item.prices![size]} />
              </span>
            ))}
          </span>
        )}
      </div>
      {item.description && <p className="item__description">{item.description}</p>}
    </li>
  )
}
