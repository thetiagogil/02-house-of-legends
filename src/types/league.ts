export type House = "Gryffindor" | "Hufflepuff" | "Ravenclaw" | "Slytherin";

export type Region = string;

export type ChampionInfo = {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
};

export type ChampionSummary = {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  tags: string[];
  house: House;
  region: Region;
};

export type ChampionSkin = {
  num: number;
  name: string;
};

export type ChampionSpell = {
  id: string;
  name: string;
  description: string;
};

export type ChampionPassive = {
  name: string;
  description: string;
};

export type ChampionDetail = ChampionSummary & {
  lore: string;
  skins: ChampionSkin[];
  spells: ChampionSpell[];
  passive: ChampionPassive;
  allytips: string[];
  enemytips: string[];
};

export type ItemCategory =
  | "Starter"
  | "Boots"
  | "Basic"
  | "Epic"
  | "Legendary"
  | "Consumable"
  | "Trinket"
  | "Other";

export type Item = {
  id: string;
  name: string;
  description: string;
  plaintext: string;
  gold: {
    total: number;
    base: number;
    sell: number;
    purchasable: boolean;
  };
  tags: string[];
  image: {
    full: string;
  };
  maps: Record<string, boolean>;
  from?: string[];
  into?: string[];
  depth?: number;
  category: ItemCategory;
};

export type BuildItem = {
  id: string;
  name: string;
  price: number;
};

export type Build = {
  id: string;
  title: string;
  champion: {
    id: string;
    name: string;
    key: string;
  };
  items: BuildItem[];
  win: number;
  loss: number;
  createdAt: number;
};
