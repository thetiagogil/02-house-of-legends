import type { Item, ItemCategory } from "../types";

export type ActiveItemCategory = ItemCategory | "All";
export type ItemSort = "Price High" | "Price Low" | "Name";

export const ITEM_SORT_OPTIONS: ItemSort[] = [
  "Price High",
  "Price Low",
  "Name",
];

export const itemCategoryLabels: Record<ItemCategory, string> = {
  Starter: "Starter Relics",
  Boots: "Enchanted Boots",
  Basic: "Basic Components",
  Epic: "Epic Artifacts",
  Legendary: "Legendary Artifacts",
  Consumable: "Consumables",
  Trinket: "Trinkets",
  Other: "Other",
};

export const itemCategoryHints: Record<ItemCategory, string> = {
  Starter: "Opening purchases for early pressure",
  Boots: "Movement and utility footwear",
  Basic: "Small components and stat pieces",
  Epic: "Mid-tier powers before final items",
  Legendary: "Full-build power spikes",
  Consumable: "Temporary effects and sustain",
  Trinket: "Vision and map utility",
  Other: "Miscellaneous relics",
};

export function getItemCounts(
  items: Item[],
  categories: ItemCategory[],
): Record<ItemCategory, number> {
  return categories.reduce(
    (counts, category) => ({
      ...counts,
      [category]: items.filter((item) => item.category === category).length,
    }),
    {} as Record<ItemCategory, number>,
  );
}

export function getItemCategoryLabel(category: ActiveItemCategory): string {
  return category === "All" ? "All Artifacts" : itemCategoryLabels[category];
}

export function getItemCategoryHint(category: ActiveItemCategory): string {
  return category === "All"
    ? "Every purchasable item in the archive"
    : itemCategoryHints[category];
}

export function filterItems(
  items: Item[],
  activeCategory: ActiveItemCategory,
  search: string,
): Item[] {
  const query = search.trim().toLowerCase();

  return items.filter((item) => {
    if (activeCategory !== "All" && item.category !== activeCategory) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      item.name.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });
}

export function sortItems(items: Item[], sort: ItemSort): Item[] {
  return [...items].sort((firstItem, secondItem) => {
    if (sort === "Name") {
      return firstItem.name.localeCompare(secondItem.name);
    }

    if (sort === "Price Low") {
      return firstItem.gold.total - secondItem.gold.total;
    }

    return secondItem.gold.total - firstItem.gold.total;
  });
}
