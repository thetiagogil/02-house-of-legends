import { fetchJson } from "../../../lib/fetch-json";
import { getDataDragonVersion } from "../../../lib/data-dragon-version";
import { getHouseForChampion } from "../data/houses";
import { normalizeRegion } from "../data/regions";
import type { ChampionDetail, ChampionInfo, ChampionSummary } from "../types";
import { fetchChampionFactions, getChampionFaction } from "./universe";

let championsPromise: Promise<ChampionSummary[]> | null = null;
const championDetailPromises = new Map<string, Promise<ChampionDetail>>();

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
    championsPromise = getDataDragonVersion()
      .then(async (version) => {
        const [data, factions] = await Promise.all([
          fetchJson<ChampionListResponse>(
            `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
          ),
          fetchChampionFactions(),
        ]);

        return Object.values(data.data)
          .map((champion) =>
            mapChampionSummary(
              champion,
              getChampionFaction(factions, champion),
            ),
          )
          .sort((a, b) => a.name.localeCompare(b.name));
      })
      .catch((error) => {
        championsPromise = null;
        throw error;
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

  const promise = getDataDragonVersion()
    .then(async (version) => {
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
    })
    .catch((error) => {
      championDetailPromises.delete(championId);
      throw error;
    });

  championDetailPromises.set(championId, promise);
  return promise;
}
