import { useState } from "react";
import { Icon } from "../../../shared/components/ui/Icon";
import { championImages } from "../../champions/lib/champion-images";
import { getBuildsTotalGames } from "../lib/build-metrics";
import type { Build } from "../types";
import { BuildRow } from "./BuildRow";

type BuildGroupProps = {
  champion: Build["champion"];
  builds: Build[];
  version: string;
  onChange: () => void;
};

export const BuildGroup = ({
  champion,
  builds,
  version,
  onChange,
}: BuildGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalGames = getBuildsTotalGames(builds);

  return (
    <article className="build-group">
      <button
        type="button"
        className="build-group__header"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
      >
        <img src={championImages.tile(champion.id)} alt="" />
        <div className="build-group__title">
          <span>{champion.name}</span>
          <small>
            <strong>{builds.length}</strong>{" "}
            {builds.length === 1 ? "build" : "builds"} / {totalGames} games
          </small>
        </div>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          className="build-group__icon"
        />
      </button>

      {isOpen && (
        <div className="build-group__rows">
          {builds.map((build) => (
            <BuildRow
              key={build.id}
              build={build}
              version={version}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </article>
  );
};
