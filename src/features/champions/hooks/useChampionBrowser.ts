import { useEffect, useState } from "react";
import { fetchChampions } from "../api/data-dragon";
import {
  filterChampions,
  getChampionRegions,
  getChampionRoles,
} from "../lib/champion-filters";
import type { ChampionSummary, House, Region } from "../types";

export const useChampionBrowser = () => {
  const [champions, setChampions] = useState<ChampionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [house, setHouse] = useState<House | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadChampions() {
      try {
        const loadedChampions = await fetchChampions();

        if (shouldUpdate) {
          setChampions(loadedChampions);
          setError("");
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to summon champions.");
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadChampions();

    return () => {
      shouldUpdate = false;
    };
  }, []);

  const allRoles = getChampionRoles(champions);
  const allRegions = getChampionRegions(champions);
  const filteredChampions = filterChampions(champions, {
    search,
    role,
    house,
    region,
  });

  function resetFilters() {
    setSearch("");
    setRole(null);
    setHouse(null);
    setRegion(null);
  }

  return {
    allRegions,
    allRoles,
    champions,
    error,
    filteredChampions,
    house,
    isLoading,
    region,
    resetFilters,
    role,
    search,
    setHouse,
    setRegion,
    setRole,
    setSearch,
  };
};
