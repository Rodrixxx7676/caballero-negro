import type { Category } from '../types/menu'
import { MenuItemRow } from './MenuItemRow'

interface Props {
  category: Category
  currency: string
}

export function CategorySection({ category, currency }: Props) {
  const hasGroups = (category.groups?.length ?? 0) > 0

  return (
    <section id={category.id} className="category" aria-labelledby={`${category.id}-title`}>
      <header className="category__header">
        <h2 id={`${category.id}-title`} className="category__title">
          {category.name}
        </h2>
        <span className="ornament" aria-hidden="true" />
      </header>

      {category.intro && (
        <div className="category__intro">
          {category.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      {category.sizes && (
        <div className="category__sizes" aria-hidden="true">
          {category.sizes.map((size) => (
            <span key={size}>{size}</span>
          ))}
        </div>
      )}

      {category.items.length > 0 && (
        <ul className="items">
          {category.items.map((item) => (
            <MenuItemRow key={item.id} item={item} currency={currency} sizes={category.sizes} />
          ))}
        </ul>
      )}

      {hasGroups &&
        category.groups!.map((group) => (
          <div key={group.name} className="group">
            <h3 className="group__title">{group.name}</h3>
            <ul className="items items--compact">
              {group.items.map((item) => (
                <MenuItemRow key={item.id} item={item} currency={currency} />
              ))}
            </ul>
            {group.note && <p className="note note--italic">{group.note}</p>}
          </div>
        ))}

      {category.note && (
        <div className="proteins">
          <h3 className="group__title">{category.note.title}</h3>
          <ul className="proteins__list">
            {category.note.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </div>
      )}

      {category.notes?.map((note, i) => (
        <p key={note} className={i === 0 ? 'note note--italic' : 'note note--ribbon'}>
          {note}
        </p>
      ))}
    </section>
  )
}
