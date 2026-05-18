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
