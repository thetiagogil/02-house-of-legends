import { useEffect, useState } from "react";
import { getDataDragonVersion } from "../../../lib/data-dragon-version";
import { fetchItems, ITEM_CATEGORIES } from "../api/data-dragon-items";
import {
  type ActiveItemCategory,
  type ItemSort,
  filterItems,
  getItemCategoryHint,
  getItemCategoryLabel,
  getItemCounts,
  sortItems,
} from "../lib/item-browser";
import type { Item } from "../types";

export const useItemsBrowser = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ActiveItemCategory>("All");
  const [sort, setSort] = useState<ItemSort>("Price High");

  useEffect(() => {
    let shouldUpdate = true;

    async function loadItems() {
      try {
        const [loadedItems, loadedVersion] = await Promise.all([
          fetchItems(),
          getDataDragonVersion(),
        ]);

        if (shouldUpdate) {
          setItems(loadedItems);
          setVersion(loadedVersion);
          setError("");
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to open the item archive.");
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      shouldUpdate = false;
    };
  }, []);

  const itemCounts = getItemCounts(items, ITEM_CATEGORIES);
  const visibleItems = sortItems(
    filterItems(items, activeCategory, search),
    sort,
  );

  return {
    activeCategory,
    activeHint: getItemCategoryHint(activeCategory),
    activeLabel: getItemCategoryLabel(activeCategory),
    error,
    isLoading,
    itemCounts,
    items,
    search,
    setActiveCategory,
    setSearch,
    setSort,
    sort,
    version,
    visibleItems,
  };
};
