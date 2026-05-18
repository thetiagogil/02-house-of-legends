import type { ChampionDetail } from "../types";
import { HouseBadge } from "./HouseBadge";
import { RegionBadge } from "./RegionBadge";
import { StatBar } from "./StatBar";

type ChampionPanelProps = {
  champion: ChampionDetail;
};

export function ChampionPanel({ champion }: ChampionPanelProps) {
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
          <blockquote>{`"${champion.blurb}"`}</blockquote>

          <h2 className="detail-label detail-label--spaced">Passive</h2>
          <p>
            <strong>{champion.passive.name}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
