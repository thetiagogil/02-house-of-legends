import type { ItemCategory } from "../types";

export type ClassifiableItem = {
  gold?: {
    total?: number;
  };
  tags?: string[];
  from?: string[];
  into?: string[];
};

export const classifyItem = (item: ClassifiableItem): ItemCategory => {
  const tags = item.tags ?? [];
  const total = item.gold?.total ?? 0;
  const hasFrom = Array.isArray(item.from) && item.from.length > 0;
  const hasInto = Array.isArray(item.into) && item.into.length > 0;

  if (tags.includes("Trinket")) {
    return "Trinket";
  }

  if (tags.includes("Consumable")) {
    return "Consumable";
  }

  if (tags.includes("Boots")) {
    return "Boots";
  }

  if (!hasFrom && total > 0 && total <= 500) {
    return "Starter";
  }

  if (!hasInto && total >= 2500) {
    return "Legendary";
  }

  if (hasFrom && total >= 1100) {
    return "Epic";
  }

  return "Basic";
};
