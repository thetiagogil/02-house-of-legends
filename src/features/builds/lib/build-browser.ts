import type { Build } from "../types";
import { getBuildCost, getBuildGames } from "./build-metrics";
import { calculateWinRate } from "./win-rate";

export type BuildSort = "Newest" | "Champion" | "Win Rate" | "Games" | "Cost";

export type BuildGroup = {
  championId: string;
  champion: Build["champion"];
  builds: Build[];
};

export const BUILD_SORT_OPTIONS: BuildSort[] = [
  "Newest",
  "Champion",
  "Win Rate",
  "Games",
  "Cost",
];

export function filterBuilds(builds: Build[], search: string): Build[] {
  const query = search.trim().toLowerCase();

  if (!query) {
    return builds;
  }

  return builds.filter((build) => {
    return (
      build.title.toLowerCase().includes(query) ||
      build.champion.name.toLowerCase().includes(query)
    );
  });
}

export function sortBuilds(builds: Build[], sort: BuildSort): Build[] {
  return [...builds].sort((firstBuild, secondBuild) => {
    if (sort === "Champion") {
      return firstBuild.champion.name.localeCompare(secondBuild.champion.name);
    }

    if (sort === "Win Rate") {
      return calculateWinRate(secondBuild) - calculateWinRate(firstBuild);
    }

    if (sort === "Games") {
      return getBuildGames(secondBuild) - getBuildGames(firstBuild);
    }

    if (sort === "Cost") {
      return getBuildCost(secondBuild) - getBuildCost(firstBuild);
    }

    return secondBuild.createdAt - firstBuild.createdAt;
  });
}

export function groupBuildsByChampion(builds: Build[]): BuildGroup[] {
  const groups = new Map<string, Build[]>();

  builds.forEach((build) => {
    const currentBuilds = groups.get(build.champion.id) ?? [];
    groups.set(build.champion.id, [...currentBuilds, build]);
  });

  return Array.from(groups.entries())
    .map(([championId, championBuilds]) => ({
      championId,
      champion: championBuilds[0].champion,
      builds: championBuilds,
    }))
    .sort((firstGroup, secondGroup) =>
      firstGroup.champion.name.localeCompare(secondGroup.champion.name),
    );
}
