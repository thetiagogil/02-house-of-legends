import { ITEM_CATEGORIES } from "../api/data-dragon-items";
import {
  type ActiveItemCategory,
  itemCategoryConfig,
} from "../lib/item-browser";
import type { ItemCategory } from "../types";

type ItemCategoryPanelProps = {
  activeCategory: ActiveItemCategory;
  itemCounts: Record<ItemCategory, number>;
  totalCount: number;
  onCategoryChange: (category: ActiveItemCategory) => void;
};

export const ItemCategoryPanel = ({
  activeCategory,
  itemCounts,
  totalCount,
  onCategoryChange,
}: ItemCategoryPanelProps) => {
  return (
    <aside className="item-category-panel" aria-label="Item categories">
      <button
        type="button"
        onClick={() => onCategoryChange("All")}
        aria-pressed={activeCategory === "All"}
        className={
          activeCategory === "All"
            ? "item-category-card item-category-card--active"
            : "item-category-card"
        }
      >
        <span>
          <strong>All Artifacts</strong>
          <small>Complete archive</small>
        </span>
        <em>{totalCount}</em>
      </button>

      {ITEM_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          aria-pressed={activeCategory === category}
          className={
            activeCategory === category
              ? "item-category-card item-category-card--active"
              : "item-category-card"
          }
        >
          <span>
            <strong>{itemCategoryConfig[category].label}</strong>
            <small>{itemCategoryConfig[category].hint}</small>
          </span>
          <em>{itemCounts[category]}</em>
        </button>
      ))}
    </aside>
  );
};
