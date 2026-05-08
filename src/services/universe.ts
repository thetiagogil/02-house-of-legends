const CHAMPION_FACTIONS_URL =
  "https://universe-meeps.leagueoflegends.com/v1/en_us/champion-browse/index.json";

let championFactionsPromise: Promise<Record<string, string>> | null = null;

type UniverseChampion = {
  slug: string;
  name: string;
  "associated-faction-slug"?: string;
};

type UniverseChampionBrowseResponse = {
  champions: UniverseChampion[];
};

type ChampionFactionLookupInput = {
  id: string;
  name: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("The Universe data service did not respond correctly.");
  }

  return response.json() as Promise<T>;
}

function normalizeChampionKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function setFaction(
  factions: Record<string, string>,
  key: string,
  faction: string,
) {
  const normalizedKey = normalizeChampionKey(key);

  if (normalizedKey) {
    factions[normalizedKey] = faction;
  }
}

function buildFactionLookup(
  champions: UniverseChampion[],
): Record<string, string> {
  const factions: Record<string, string> = {};

  for (const champion of champions) {
    const faction = champion["associated-faction-slug"];

    if (faction) {
      setFaction(factions, champion.slug, faction);
      setFaction(factions, champion.name, faction);
    }
  }

  return factions;
}

export function getChampionFaction(
  factions: Record<string, string>,
  champion: ChampionFactionLookupInput,
): string | undefined {
  return (
    factions[normalizeChampionKey(champion.id)] ??
    factions[normalizeChampionKey(champion.name)]
  );
}

export async function fetchChampionFactions(): Promise<Record<string, string>> {
  if (!championFactionsPromise) {
    championFactionsPromise = fetchJson<UniverseChampionBrowseResponse>(
      CHAMPION_FACTIONS_URL,
    )
      .then((data) => buildFactionLookup(data.champions))
      .catch(() => ({}));
  }

  return championFactionsPromise;
}
