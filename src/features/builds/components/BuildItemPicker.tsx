import { FilterButton } from "../../../shared/components/ui/FilterButton";
import { SearchBar } from "../../../shared/components/ui/SearchBar";
import { itemImage } from "../../items/lib/item-images";
import type { Item, ItemCategory } from "../../items/types";
import {
  ARTIFACT_CATEGORIES,
  filterBuildItemOptions,
} from "../lib/build-form-options";

type BuildItemPickerProps = {
  items: Item[];
  selectedItemIds: Set<string>;
  currentItemId: string;
  slotIndex: number;
  search: string;
  artifactCategory: ItemCategory | "All";
  version: string;
  onSearchChange: (value: string) => void;
  onArtifactCategoryChange: (value: ItemCategory | "All") => void;
  onSelect: (item: Item) => void;
  onClear: () => void;
};

export function BuildItemPicker({
  items,
  selectedItemIds,
  currentItemId,
  slotIndex,
  search,
  artifactCategory,
  version,
  onSearchChange,
  onArtifactCategoryChange,
  onSelect,
  onClear,
}: BuildItemPickerProps) {
  const filteredItems = filterBuildItemOptions(
    items,
    search,
    slotIndex,
    artifactCategory,
  );

  return (
    <>
      <div className="picker-panel__header">
        <div>
          <h2>
            {slotIndex === 0 ? "Choose Boots" : `Choose Item ${slotIndex}`}
          </h2>
          <p>{filteredItems.length} matching artifacts</p>
        </div>
        {currentItemId && (
          <button
            type="button"
            onClick={onClear}
            className="muted-action picker-panel__clear"
          >
            Clear
          </button>
        )}
      </div>

      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search items..."
      />

      {slotIndex > 0 && (
        <div className="filter-row picker-filter-row">
          {ARTIFACT_CATEGORIES.map((category) => (
            <FilterButton
              key={category}
              active={artifactCategory === category}
              onClick={() => onArtifactCategoryChange(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>
      )}

      <div className="item-picker-list">
        {filteredItems.map((item) => {
          const isActive = currentItemId === item.id;
          const isTaken = selectedItemIds.has(item.id) && !isActive;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              disabled={isTaken}
              className={
                isActive
                  ? "item-picker-card item-picker-card--active"
                  : "item-picker-card"
              }
            >
              {version ? (
                <img
                  src={itemImage(version, item.image.full)}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <span className="item-picker-card__placeholder" />
              )}
              <span className="item-picker-card__content">
                <strong>{item.name}</strong>
                <small>
                  {item.plaintext || item.tags.slice(0, 3).join(" / ")}
                </small>
              </span>
              <span className="item-picker-card__price">
                {item.gold.total.toLocaleString()}g
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
