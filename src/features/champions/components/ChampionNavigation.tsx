import { Link } from "react-router-dom";
import { Icon } from "../../../shared/components/ui/Icon";
import type { ChampionSummary } from "../types";

type ChampionNavigationProps = {
  previousChampion: ChampionSummary | null;
  nextChampion: ChampionSummary | null;
  onPrevious: () => void;
  onNext: () => void;
};

export function ChampionNavigation({
  previousChampion,
  nextChampion,
  onPrevious,
  onNext,
}: ChampionNavigationProps) {
  return (
    <div className="champion-navigation">
      <button
        type="button"
        disabled={!previousChampion}
        onClick={onPrevious}
        className="outline-action"
      >
        <Icon name="chevron-left" size={16} />
        {previousChampion?.name ?? "Start"}
      </button>

      <Link to="/champions" className="muted-action">
        All Champions
      </Link>

      <button
        type="button"
        disabled={!nextChampion}
        onClick={onNext}
        className="outline-action"
      >
        {nextChampion?.name ?? "End"}
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  );
}
