import type { Item, ItemCategory } from "../types";

export type ActiveItemCategory = ItemCategory | "All";
export type ItemSort = "Price High" | "Price Low" | "Name";

export const ITEM_SORT_OPTIONS: ItemSort[] = [
  "Price High",
  "Price Low",
  "Name",
];

export const itemCategoryConfig: Record<
  ItemCategory,
  { label: string; hint: string }
> = {
  Starter: {
    label: "Starter Relics",
    hint: "Opening purchases for early pressure",
  },
  Boots: {
    label: "Enchanted Boots",
    hint: "Movement and utility footwear",
  },
  Basic: {
    label: "Basic Components",
    hint: "Small components and stat pieces",
  },
  Epic: {
    label: "Epic Artifacts",
    hint: "Mid-tier powers before final items",
  },
  Legendary: {
    label: "Legendary Artifacts",
    hint: "Full-build power spikes",
  },
  Consumable: {
    label: "Consumables",
    hint: "Temporary effects and sustain",
  },
  Trinket: {
    label: "Trinkets",
    hint: "Vision and map utility",
  },
  Other: {
    label: "Other",
    hint: "Miscellaneous relics",
  },
};

export const getItemCounts = (
  items: Item[],
  categories: ItemCategory[],
): Record<ItemCategory, number> => {
  return categories.reduce(
    (counts, category) => ({
      ...counts,
      [category]: items.filter((item) => item.category === category).length,
    }),
    {} as Record<ItemCategory, number>,
  );
};

export const getItemCategoryLabel = (category: ActiveItemCategory): string => {
  return category === "All"
    ? "All Artifacts"
    : itemCategoryConfig[category].label;
};

export const getItemCategoryHint = (category: ActiveItemCategory): string => {
  return category === "All"
    ? "Every purchasable item in the archive"
    : itemCategoryConfig[category].hint;
};

export const filterItems = (
  items: Item[],
  activeCategory: ActiveItemCategory,
  search: string,
): Item[] => {
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
};

export const sortItems = (items: Item[], sort: ItemSort): Item[] => {
  return [...items].sort((firstItem, secondItem) => {
    if (sort === "Name") {
      return firstItem.name.localeCompare(secondItem.name);
    }

    if (sort === "Price Low") {
      return firstItem.gold.total - secondItem.gold.total;
    }

    return secondItem.gold.total - firstItem.gold.total;
  });
};
