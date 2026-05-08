import { getHouseForChampion } from "../data/houses";
import { normalizeRegion } from "../data/regions";
import { fetchChampionFactions, getChampionFaction } from "./universe";
import type {
  ChampionDetail,
  ChampionInfo,
  ChampionSummary,
  Item,
  ItemCategory,
} from "../types/league";

const VERSION_KEY = "house-of-legends-ddragon-version";

let cachedVersion: string | null = null;
let versionPromise: Promise<string> | null = null;
let championsPromise: Promise<ChampionSummary[]> | null = null;
const championDetailPromises = new Map<string, Promise<ChampionDetail>>();
let itemsPromise: Promise<Item[]> | null = null;

type DataDragonChampionSummary = {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  tags: string[];
  region?: string;
  faction?: string;
};

type DataDragonChampionDetail = DataDragonChampionSummary & {
  lore: string;
  skins: { num: number; name: string }[];
  spells: { id: string; name: string; description: string }[];
  passive: { name: string; description: string };
  allytips: string[];
  enemytips: string[];
};

type ChampionListResponse = {
  data: Record<string, DataDragonChampionSummary>;
};

type ChampionDetailResponse = {
  data: Record<string, DataDragonChampionDetail>;
};

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("The League data service did not respond correctly.");
  }

  return response.json() as Promise<T>;
}

export async function getVersion(): Promise<string> {
  if (cachedVersion) {
    return cachedVersion;
  }

  const stored = sessionStorage.getItem(VERSION_KEY);

  if (stored) {
    cachedVersion = stored;
    return stored;
  }

  if (!versionPromise) {
    versionPromise = fetchJson<string[]>(
      "https://ddragon.leagueoflegends.com/api/versions.json",
    )
      .then((versions) => {
        const latestVersion = versions[0];
        cachedVersion = latestVersion;
        sessionStorage.setItem(VERSION_KEY, latestVersion);
        return latestVersion;
      })
      .finally(() => {
        versionPromise = null;
      });
  }

  return versionPromise;
}

function mapChampionSummary(
  champion: DataDragonChampionSummary,
  explicitRegion?: string,
): ChampionSummary {
  const region = normalizeRegion(
    explicitRegion ?? champion.region ?? champion.faction,
  );

  return {
    id: champion.id,
    key: champion.key,
    name: champion.name,
    title: champion.title,
    blurb: champion.blurb,
    info: champion.info,
    tags: champion.tags,
    house: getHouseForChampion({
      id: champion.id,
      tags: champion.tags,
      info: champion.info,
      region,
    }),
    region,
  };
}

export async function fetchChampions(): Promise<ChampionSummary[]> {
  if (!championsPromise) {
    championsPromise = getVersion().then(async (version) => {
      const [data, factions] = await Promise.all([
        fetchJson<ChampionListResponse>(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
        ),
        fetchChampionFactions(),
      ]);

      return Object.values(data.data)
        .map((champion) =>
          mapChampionSummary(champion, getChampionFaction(factions, champion)),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  return championsPromise;
}

export async function fetchChampion(
  championId: string,
): Promise<ChampionDetail> {
  const cached = championDetailPromises.get(championId);

  if (cached) {
    return cached;
  }

  const promise = getVersion().then(async (version) => {
    const [data, factions] = await Promise.all([
      fetchJson<ChampionDetailResponse>(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${championId}.json`,
      ),
      fetchChampionFactions(),
    ]);
    const champion = data.data[championId];

    if (!champion) {
      throw new Error("Champion not found.");
    }

    return {
      ...mapChampionSummary(champion, getChampionFaction(factions, champion)),
      lore: champion.lore,
      skins: champion.skins,
      spells: champion.spells.map((spell) => ({
        id: spell.id,
        name: spell.name,
        description: spell.description,
      })),
      passive: {
        name: champion.passive.name,
        description: champion.passive.description,
      },
      allytips: champion.allytips,
      enemytips: champion.enemytips,
    };
  });

  championDetailPromises.set(championId, promise);
  return promise;
}

function classifyItem(item: DataDragonItem): ItemCategory {
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
}

function isVisibleItem(item: Item): boolean {
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
}

export async function fetchItems(): Promise<Item[]> {
  if (!itemsPromise) {
    itemsPromise = getVersion().then(async (version) => {
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
    });
  }

  return itemsPromise;
}

export const championImages = {
  loading: (championId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`,
  splash: (championId: string, skin = 0) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skin}.jpg`,
  centered: (championId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${championId}_0.jpg`,
  tile: (championId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${championId}_0.jpg`,
};

export function itemImage(version: string, imageName: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${imageName}`;
}
