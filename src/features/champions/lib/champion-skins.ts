import type { ChampionSkin, ChampionSummary } from "../types";

export const getVisibleSkins = (skins: ChampionSkin[]): ChampionSkin[] => {
  const baseSkins = skins.filter((skin) => !skin.name.includes("("));
  return baseSkins.length > 0 ? baseSkins : skins;
};

export const getSkinLabel = (skin?: ChampionSkin): string => {
  if (!skin) {
    return "";
  }

  return skin.name === "default" ? "Classic" : skin.name;
};

export const getAdjacentChampions = (
  champions: ChampionSummary[],
  championId?: string,
) => {
  const currentIndex = champions.findIndex(
    (currentChampion) => currentChampion.id === championId,
  );

  return {
    previousChampion: currentIndex > 0 ? champions[currentIndex - 1] : null,
    nextChampion:
      currentIndex >= 0 && currentIndex < champions.length - 1
        ? champions[currentIndex + 1]
        : null,
  };
};
