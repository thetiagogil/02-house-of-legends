import { useEffect, useState } from "react";
import { getDataDragonVersion } from "../../../lib/data-dragon-version";
import { fetchChampions } from "../../champions/api/data-dragon";
import type { ChampionSummary } from "../../champions/types";
import { fetchItems } from "../../items/api/data-dragon-items";
import type { Item } from "../../items/types";

export function useBuildFormData() {
  const [champions, setChampions] = useState<ChampionSummary[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let shouldUpdate = true;

    async function loadFormData() {
      try {
        const [loadedChampions, loadedItems, loadedVersion] = await Promise.all(
          [fetchChampions(), fetchItems(), getDataDragonVersion()],
        );

        if (shouldUpdate) {
          setChampions(loadedChampions);
          setItems(loadedItems);
          setVersion(loadedVersion);
          setError("");
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to prepare the forge.");
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadFormData();

    return () => {
      shouldUpdate = false;
    };
  }, []);

  return {
    champions,
    error,
    isLoading,
    items,
    version,
  };
}
