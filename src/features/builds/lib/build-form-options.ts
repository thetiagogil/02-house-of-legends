import type { ChampionSummary } from "../../champions/types";
import type { Item, ItemCategory } from "../../items/types";
import type { BuildItem } from "../types";

export const EMPTY_BUILD_SLOTS = ["", "", "", "", "", ""];
export const BUILD_SLOT_INDEXES = [0, 1, 2, 3, 4, 5];
export const ARTIFACT_CATEGORIES: Array<ItemCategory | "All"> = [
  "All",
  "Legendary",
  "Epic",
];

export type PickerTarget =
  | { type: "champion" }
  | { type: "item"; slotIndex: number };

export type BuildItemOptions = {
  boots: Item[];
  artifacts: Item[];
};

export const getBuildItemOptions = (items: Item[]): BuildItemOptions => {
  return {
    boots: items
      .filter((item) => item.category === "Boots")
      .sort((firstItem, secondItem) =>
        firstItem.name.localeCompare(secondItem.name),
      ),
    artifacts: items
      .filter(
        (item) => item.category === "Legendary" || item.category === "Epic",
      )
      .sort((firstItem, secondItem) =>
        firstItem.name.localeCompare(secondItem.name),
      ),
  };
};

export const getChampionRoles = (champions: ChampionSummary[]): string[] => {
  return Array.from(
    new Set(champions.flatMap((champion) => champion.tags)),
  ).sort();
};

export const getSelectedBuildItems = (
  items: Item[],
  slots: string[],
): Array<Item | null> => {
  return slots.map(
    (itemId) => items.find((item) => item.id === itemId) ?? null,
  );
};

export const getSelectedItemIds = (slots: string[]): Set<string> => {
  return new Set(slots.filter(Boolean));
};

export const getCompletedSlotCount = (items: Array<Item | null>): number => {
  return items.filter(Boolean).length;
};

export const getBuildTotalCost = (items: Array<Item | null>): number => {
  return items.reduce((total, item) => total + (item?.gold.total ?? 0), 0);
};

export const isBuildFormComplete = (
  champion: ChampionSummary | null,
  title: string,
  items: Array<Item | null>,
): boolean => {
  return Boolean(champion && title.trim() && items.every(Boolean));
};

export const getNextEmptySlot = (
  slots: string[],
  currentIndex: number,
): number => {
  return slots.findIndex((slot, index) => index > currentIndex && !slot);
};

export const toBuildItems = (items: Array<Item | null>): BuildItem[] => {
  return items.flatMap((item) => {
    if (!item) {
      return [];
    }

    return {
      id: item.id,
      name: item.name,
      price: item.gold.total,
    };
  });
};

export const filterChampionOptions = (
  champions: ChampionSummary[],
  search: string,
  role: string,
): ChampionSummary[] => {
  const query = search.trim().toLowerCase();

  return champions.filter((champion) => {
    if (query && !champion.name.toLowerCase().includes(query)) {
      return false;
    }

    if (role !== "All" && !champion.tags.includes(role)) {
      return false;
    }

    return true;
  });
};

export const filterBuildItemOptions = (
  items: Item[],
  search: string,
  slotIndex: number,
  artifactCategory: ItemCategory | "All",
): Item[] => {
  const query = search.trim().toLowerCase();

  return items
    .filter((item) => {
      if (query && !item.name.toLowerCase().includes(query)) {
        return false;
      }

      if (
        slotIndex > 0 &&
        artifactCategory !== "All" &&
        item.category !== artifactCategory
      ) {
        return false;
      }

      return true;
    })
    .sort((firstItem, secondItem) =>
      firstItem.name.localeCompare(secondItem.name),
    );
};
