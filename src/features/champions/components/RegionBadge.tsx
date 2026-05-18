import { getRegionLabel } from "../data/regions";
import type { Region } from "../types";

type RegionBadgeProps = {
  region: Region;
};

export function RegionBadge({ region }: RegionBadgeProps) {
  return <span className="region-badge">{getRegionLabel(region)}</span>;
}
