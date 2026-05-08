import { houseStyles } from "../data/houses";
import type { House } from "../types/league";
import { HouseIcon } from "./HouseIcon";

type HouseBadgeProps = {
  house: House;
  size?: "small" | "medium";
};

export function HouseBadge({ house, size = "small" }: HouseBadgeProps) {
  const houseStyle = houseStyles[house];

  return (
    <span
      className={`house-badge ${houseStyle.className} house-badge--${size}`}
    >
      <HouseIcon house={house} className="house-badge__icon" />
      {house}
    </span>
  );
}
