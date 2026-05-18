import { getRegionLabel } from "../data/regions";
import type { ChampionSummary, House, Region } from "../types";

export type ChampionFilters = {
  search: string;
  role: string | null;
  house: House | null;
  region: Region | null;
};

export function getChampionRoles(champions: ChampionSummary[]): string[] {
  return Array.from(
    new Set(champions.flatMap((champion) => champion.tags)),
  ).sort();
}

export function getChampionRegions(champions: ChampionSummary[]): Region[] {
  return Array.from(new Set(champions.map((champion) => champion.region))).sort(
    (firstRegion, secondRegion) =>
      getRegionLabel(firstRegion).localeCompare(getRegionLabel(secondRegion)),
  ) as Region[];
}

export function filterChampions(
  champions: ChampionSummary[],
  filters: ChampionFilters,
): ChampionSummary[] {
  const query = filters.search.trim().toLowerCase();

  return champions.filter((champion) => {
    if (query && !champion.name.toLowerCase().includes(query)) {
      return false;
    }

    if (filters.role && !champion.tags.includes(filters.role)) {
      return false;
    }

    if (filters.house && champion.house !== filters.house) {
      return false;
    }

    if (filters.region && champion.region !== filters.region) {
      return false;
    }

    return true;
  });
}
