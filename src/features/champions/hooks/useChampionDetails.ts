import { useEffect, useState } from "react";
import { fetchChampion, fetchChampions } from "../api/data-dragon";
import { championImages } from "../lib/champion-images";
import { getAdjacentChampions, getVisibleSkins } from "../lib/champion-skins";
import type { ChampionDetail, ChampionSummary } from "../types";

export const useChampionDetails = (championId?: string) => {
  const [champion, setChampion] = useState<ChampionDetail | null>(null);
  const [champions, setChampions] = useState<ChampionSummary[]>([]);
  const [skinIndex, setSkinIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let shouldUpdate = true;

    async function loadChampion() {
      if (!championId) {
        setIsLoading(false);
        setError("Champion not found.");
        return;
      }

      setIsLoading(true);

      try {
        const [loadedChampion, loadedChampions] = await Promise.all([
          fetchChampion(championId),
          fetchChampions(),
        ]);

        if (shouldUpdate) {
          setChampion(loadedChampion);
          setChampions(loadedChampions);
          setSkinIndex(0);
          setError("");
        }
      } catch {
        if (shouldUpdate) {
          setError("Champion not found.");
          setChampion(null);
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadChampion();

    return () => {
      shouldUpdate = false;
    };
  }, [championId]);

  const { previousChampion, nextChampion } = getAdjacentChampions(
    champions,
    championId,
  );
  const visibleSkins = champion ? getVisibleSkins(champion.skins) : [];
  const currentSkin = visibleSkins[skinIndex];
  const splashImage = champion
    ? championImages.splash(champion.id, currentSkin?.num ?? 0)
    : "";

  function showPreviousSkin() {
    setSkinIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function showNextSkin() {
    setSkinIndex((currentIndex) =>
      Math.min(visibleSkins.length - 1, currentIndex + 1),
    );
  }

  return {
    champion,
    currentSkin,
    error,
    isLoading,
    nextChampion,
    previousChampion,
    setSkinIndex,
    showNextSkin,
    showPreviousSkin,
    skinIndex,
    splashImage,
    visibleSkins,
  };
};
