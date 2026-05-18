import { ITEM_CATEGORIES } from "../api/data-dragon-items";
import {
  type ActiveItemCategory,
  itemCategoryHints,
  itemCategoryLabels,
} from "../lib/item-browser";
import type { ItemCategory } from "../types";

type ItemCategoryPanelProps = {
  activeCategory: ActiveItemCategory;
  itemCounts: Record<ItemCategory, number>;
  totalCount: number;
  onCategoryChange: (category: ActiveItemCategory) => void;
};

export function ItemCategoryPanel({
  activeCategory,
  itemCounts,
  totalCount,
  onCategoryChange,
}: ItemCategoryPanelProps) {
  return (
    <aside className="item-category-panel" aria-label="Item categories">
      <button
        type="button"
        onClick={() => onCategoryChange("All")}
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
          className={
            activeCategory === category
              ? "item-category-card item-category-card--active"
              : "item-category-card"
          }
        >
          <span>
            <strong>{itemCategoryLabels[category]}</strong>
            <small>{itemCategoryHints[category]}</small>
          </span>
          <em>{itemCounts[category]}</em>
        </button>
      ))}
    </aside>
  );
}
