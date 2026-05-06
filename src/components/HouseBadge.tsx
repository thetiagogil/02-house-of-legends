import { houseSigils } from "../data/houses"
import type { House } from "../types/league"

type HouseBadgeProps = {
  house: House
  size?: "small" | "medium"
}

export function HouseBadge({ house, size = "small" }: HouseBadgeProps) {
  const houseStyle = houseSigils[house]

  return (
    <span className={`house-badge ${houseStyle.className} house-badge--${size}`}>
      <span aria-hidden="true">{houseStyle.sigil}</span>
      {house}
    </span>
  )
}
