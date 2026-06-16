import type { ChampionSummary } from "../types";
import { ChampionCard } from "./ChampionCard";

type ChampionGridProps = {
  champions: ChampionSummary[];
};

export const ChampionGrid = ({ champions }: ChampionGridProps) => {
  return (
    <div className="champions-grid">
      {champions.map((champion) => (
        <ChampionCard key={champion.id} champion={champion} />
      ))}
    </div>
  );
};
