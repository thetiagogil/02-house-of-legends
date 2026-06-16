import type { ChampionDetail } from "../types";
import { cleanDataDragonText } from "../lib/champion-text";
import { ChampionAbilities } from "./ChampionAbilities";
import { ChampionTips } from "./ChampionTips";
import { HouseBadge } from "./HouseBadge";
import { RegionBadge } from "./RegionBadge";
import { StatBar } from "./StatBar";

type ChampionPanelProps = {
  champion: ChampionDetail;
};

export const ChampionPanel = ({ champion }: ChampionPanelProps) => {
  const lore = cleanDataDragonText(champion.lore || champion.blurb);

  return (
    <div className="champion-panel">
      <div className="champion-panel__header">
        <p>{champion.title}</p>
        <h1>{champion.name}</h1>
        <div className="champion-panel__meta">
          <HouseBadge house={champion.house} size="medium" />
          <RegionBadge region={champion.region} />
        </div>
      </div>

      <div className="champion-panel__grid">
        <div>
          <h2 className="detail-label">Roles</h2>
          <div className="role-list">
            {champion.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <h2 className="detail-label">Stats</h2>
          <div className="stat-list">
            <StatBar label="Attack" value={champion.info.attack} />
            <StatBar label="Defense" value={champion.info.defense} />
            <StatBar label="Magic" value={champion.info.magic} />
            <StatBar label="Difficulty" value={champion.info.difficulty} />
          </div>
        </div>

        <div className="champion-lore">
          <h2 className="detail-label">Lore</h2>
          <p>{lore}</p>
        </div>
      </div>

      <ChampionAbilities passive={champion.passive} spells={champion.spells} />
      <ChampionTips
        allytips={champion.allytips}
        enemytips={champion.enemytips}
      />
    </div>
  );
};
