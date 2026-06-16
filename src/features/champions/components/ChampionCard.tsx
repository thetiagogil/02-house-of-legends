import { Link } from "react-router-dom";
import { getRegionLabel } from "../data/regions";
import { championImages } from "../lib/champion-images";
import type { ChampionSummary } from "../types";
import { HouseBadge } from "./HouseBadge";

type ChampionCardProps = {
  champion: ChampionSummary;
};

export const ChampionCard = ({ champion }: ChampionCardProps) => {
  return (
    <Link to={`/champions/${champion.id}`} className="champion-card">
      <span className="champion-card__image-wrap">
        <img
          src={championImages.loading(champion.id)}
          alt={champion.name}
          loading="lazy"
        />
        <span className="champion-card__house">
          <HouseBadge house={champion.house} />
        </span>
        <span className="champion-card__content">
          <span className="champion-card__name">{champion.name}</span>
          <span className="champion-card__title">{champion.title}</span>
          <span className="champion-card__region">
            {getRegionLabel(champion.region)}
          </span>
        </span>
      </span>
    </Link>
  );
};
