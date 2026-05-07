import { REGION_LABEL } from "../data/regions"
import type { Region } from "../types/league"

type RegionBadgeProps = {
  region: Region
}

export function RegionBadge({ region }: RegionBadgeProps) {
  return <span className="region-badge">{REGION_LABEL[region]}</span>
}
