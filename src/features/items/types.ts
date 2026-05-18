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
