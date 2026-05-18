import { getDataDragonVersion } from "../../../lib/data-dragon-version";
import { fetchJson } from "../../../lib/fetch-json";
import { classifyItem } from "../lib/classify-item";
import { isVisibleItem } from "../lib/item-filters";
import type { Item, ItemCategory } from "../types";

let itemsPromise: Promise<Item[]> | null = null;

type DataDragonItem = {
  name: string;
  description?: string;
  plaintext?: string;
  gold?: {
    total?: number;
    base?: number;
    sell?: number;
    purchasable?: boolean;
  };
  tags?: string[];
  image?: {
    full?: string;
  };
  maps?: Record<string, boolean>;
  from?: string[];
  into?: string[];
  depth?: number;
};

type ItemListResponse = {
  data: Record<string, DataDragonItem>;
};

export const ITEM_CATEGORIES: ItemCategory[] = [
  "Starter",
  "Boots",
  "Basic",
  "Epic",
  "Legendary",
  "Consumable",
  "Trinket",
];

export async function fetchItems(): Promise<Item[]> {
  if (!itemsPromise) {
    itemsPromise = getDataDragonVersion()
      .then(async (version) => {
        const data = await fetchJson<ItemListResponse>(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`,
        );

        return Object.entries(data.data)
          .map(([id, rawItem]) => {
            const item: Item = {
              id,
              name: rawItem.name,
              description: rawItem.description ?? "",
              plaintext: rawItem.plaintext ?? "",
              gold: {
                total: rawItem.gold?.total ?? 0,
                base: rawItem.gold?.base ?? 0,
                sell: rawItem.gold?.sell ?? 0,
                purchasable: rawItem.gold?.purchasable ?? false,
              },
              tags: rawItem.tags ?? [],
              image: {
                full: rawItem.image?.full ?? `${id}.png`,
              },
              maps: rawItem.maps ?? {},
              from: rawItem.from,
              into: rawItem.into,
              depth: rawItem.depth,
              category: classifyItem(rawItem),
            };

            return item;
          })
          .filter(isVisibleItem)
          .sort((a, b) => a.gold.total - b.gold.total);
      })
      .catch((error) => {
        itemsPromise = null;
        throw error;
      });
  }

  return itemsPromise;
}
