import { FilterButton } from "../../../shared/components/ui/FilterButton";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { LoadingState } from "../../../shared/components/ui/LoadingState";
import { SearchBar } from "../../../shared/components/ui/SearchBar";
import { ITEM_SORT_OPTIONS, type ItemSort } from "../lib/item-browser";
import type { Item } from "../types";
import { ItemGrid } from "./ItemGrid";

type ItemResultsPanelProps = {
  activeHint: string;
  activeLabel: string;
  error: string;
  isLoading: boolean;
  search: string;
  sort: ItemSort;
  version: string;
  visibleItems: Item[];
  onSearchChange: (search: string) => void;
  onSortChange: (sort: ItemSort) => void;
};

export function ItemResultsPanel({
  activeHint,
  activeLabel,
  error,
  isLoading,
  search,
  sort,
  version,
  visibleItems,
  onSearchChange,
  onSortChange,
}: ItemResultsPanelProps) {
  return (
    <div className="item-results-panel">
      <div className="section-heading">
        <div>
          <h2>{activeLabel}</h2>
          <p>{activeHint}</p>
        </div>
        <span>
          {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="item-results-toolbar">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onClear={() => onSearchChange("")}
          label="Search items"
          placeholder="Search item or tag..."
        />
        <div className="filter-row item-sort-row">
          {ITEM_SORT_OPTIONS.map((option) => (
            <FilterButton
              key={option}
              active={sort === option}
              onClick={() => onSortChange(option)}
            >
              {option}
            </FilterButton>
          ))}
        </div>
      </div>

      {isLoading && <LoadingState label="Opening the artifact archive..." />}

      {error && !isLoading && (
        <EmptyState title="Archive unavailable" message={error} />
      )}

      {!isLoading && !error && visibleItems.length === 0 && (
        <EmptyState
          title="No artifacts match your filters."
          message="Try another category, search, or sort order."
        />
      )}

      {!isLoading && !error && visibleItems.length > 0 && (
        <ItemGrid items={visibleItems} version={version} />
      )}
    </div>
  );
}
