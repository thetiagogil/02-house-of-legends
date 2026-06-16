import type { Item } from "../types";
import { ItemCard } from "./ItemCard";

type ItemGridProps = {
  items: Item[];
  version: string;
};

export const ItemGrid = ({ items, version }: ItemGridProps) => {
  return (
    <div className="item-browser-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} version={version} />
      ))}
    </div>
  );
};
