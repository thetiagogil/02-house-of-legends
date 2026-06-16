import type { Item } from "../types";

export const isVisibleItem = (item: Item): boolean => {
  if (Number(item.id) >= 100000) {
    return false;
  }

  if (!item.gold.purchasable) {
    return false;
  }

  if (item.gold.total <= 0) {
    return false;
  }

  if (item.name.includes("<")) {
    return false;
  }

  if (
    /\b(Quick Charge|Trinket)\b/i.test(item.name) &&
    item.category !== "Trinket"
  ) {
    return false;
  }

  if (Object.keys(item.maps).length > 0 && item.maps["11"] === false) {
    return false;
  }

  return true;
};
