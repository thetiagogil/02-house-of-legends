import { HouseBadge } from "../../champions/components/HouseBadge";
import { RegionBadge } from "../../champions/components/RegionBadge";
import { championImages } from "../../champions/lib/champion-images";
import type { ChampionSummary } from "../../champions/types";

type BuildChampionButtonProps = {
  champion: ChampionSummary | null;
  isActive: boolean;
  onSelect: () => void;
};

export function BuildChampionButton({
  champion,
  isActive,
  onSelect,
}: BuildChampionButtonProps) {
  return (
    <button
      type="button"
      className={
        isActive
          ? "champion-build-button champion-build-button--active"
          : "champion-build-button"
      }
      onClick={onSelect}
    >
      {champion ? (
        <img src={championImages.tile(champion.id)} alt="" />
      ) : (
        <span className="champion-build-button__placeholder" />
      )}
      <span className="champion-build-button__content">
        <span className="champion-build-button__title-row">
          <span>{champion?.name ?? "Choose Champion"}</span>
          {champion && (
            <span className="champion-build-button__badges">
              <HouseBadge house={champion.house} />
              <RegionBadge region={champion.region} />
            </span>
          )}
        </span>
        <small>{champion?.title ?? "Open the champion picker"}</small>
      </span>
    </button>
  );
}
