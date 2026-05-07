import { useEffect, useMemo, useState } from "react";
import { FilterButton } from "../components/FilterButton";
import { LoadingState } from "../components/LoadingState";
import { SearchBar } from "../components/SearchBar";
import {
  fetchItems,
  getVersion,
  ITEM_CATEGORIES,
  itemImage,
} from "../services/ddragon";
import type { Item, ItemCategory } from "../types/league";

const categoryLabels: Record<ItemCategory, string> = {
  Starter: "Starter Relics",
  Boots: "Enchanted Boots",
  Basic: "Basic Components",
  Epic: "Epic Artifacts",
  Legendary: "Legendary Artifacts",
  Consumable: "Consumables",
  Trinket: "Trinkets",
  Other: "Other",
};

const categoryHints: Record<ItemCategory, string> = {
  Starter: "Opening purchases for early pressure",
  Boots: "Movement and utility footwear",
  Basic: "Small components and stat pieces",
  Epic: "Mid-tier powers before final items",
  Legendary: "Full-build power spikes",
  Consumable: "Temporary effects and sustain",
  Trinket: "Vision and map utility",
  Other: "Miscellaneous relics",
};

type ActiveCategory = ItemCategory | "All";
type ItemSort = "Price High" | "Price Low" | "Name";

const SORT_OPTIONS: ItemSort[] = ["Price High", "Price Low", "Name"];

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>("Legendary");
  const [sort, setSort] = useState<ItemSort>("Price High");

  useEffect(() => {
    let shouldUpdate = true;

    async function loadItems() {
      try {
        const [loadedItems, loadedVersion] = await Promise.all([
          fetchItems(),
          getVersion(),
        ]);

        if (shouldUpdate) {
          setItems(loadedItems);
          setVersion(loadedVersion);
          setError("");
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to open the item archive.");
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      shouldUpdate = false;
    };
  }, []);

  const itemCounts = useMemo(() => {
    return ITEM_CATEGORIES.reduce(
      (counts, category) => ({
        ...counts,
        [category]: items.filter((item) => item.category === category).length,
      }),
      {} as Record<ItemCategory, number>,
    );
  }, [items]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => {
        if (activeCategory !== "All" && item.category !== activeCategory) {
          return false;
        }

        if (!query) {
          return true;
        }

        return (
          item.name.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      })
      .sort((firstItem, secondItem) => {
        if (sort === "Name") {
          return firstItem.name.localeCompare(secondItem.name);
        }

        if (sort === "Price Low") {
          return firstItem.gold.total - secondItem.gold.total;
        }

        return secondItem.gold.total - firstItem.gold.total;
      });
  }, [activeCategory, items, search, sort]);

  const activeLabel =
    activeCategory === "All" ? "All Artifacts" : categoryLabels[activeCategory];
  const activeHint =
    activeCategory === "All"
      ? "Every purchasable item in the archive"
      : categoryHints[activeCategory];

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Artifacts</h1>
        <p>{visibleItems.length} visible relics</p>
      </header>

      <section className="items-browser">
        <aside className="item-category-panel" aria-label="Item categories">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
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
            <em>{items.length}</em>
          </button>

          {ITEM_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "item-category-card item-category-card--active"
                  : "item-category-card"
              }
            >
              <span>
                <strong>{categoryLabels[category]}</strong>
                <small>{categoryHints[category]}</small>
              </span>
              <em>{itemCounts[category]}</em>
            </button>
          ))}
        </aside>

        <div className="item-results-panel">
          <div className="section-heading">
            <div>
              <h2>{activeLabel}</h2>
              <p>{activeHint}</p>
            </div>
            <span>
              {visibleItems.length}{" "}
              {visibleItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="item-results-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search item or tag..."
            />
            <div className="filter-row item-sort-row">
              {SORT_OPTIONS.map((option) => (
                <FilterButton
                  key={option}
                  active={sort === option}
                  onClick={() => setSort(option)}
                >
                  {option}
                </FilterButton>
              ))}
            </div>
          </div>

          {isLoading && (
            <LoadingState label="Opening the artifact archive..." />
          )}

          {error && !isLoading && (
            <div className="empty-state">
              <h2>Archive unavailable</h2>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && visibleItems.length === 0 && (
            <div className="empty-state">
              <h2>No artifacts match your filters.</h2>
              <p>Try another category, search, or sort order.</p>
            </div>
          )}

          {!isLoading && !error && visibleItems.length > 0 && (
            <div className="item-browser-grid">
              {visibleItems.map((item) => (
                <ItemCard key={item.id} item={item} version={version} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

type ItemCardProps = {
  item: Item;
  version: string;
};

function ItemCard({ item, version }: ItemCardProps) {
  const detail = item.plaintext || item.tags.slice(0, 3).join(" / ");

  return (
    <article className="item-card item-card--browser">
      {version ? (
        <img
          src={itemImage(version, item.image.full)}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.classList.add("item-card__image--missing");
          }}
        />
      ) : (
        <span className="item-card__image-placeholder" />
      )}
      <div className="item-card__content">
        <h3>{item.name}</h3>
        <p title={detail}>{detail}</p>
        <div className="item-card__meta">
          <span>{item.category}</span>
          <strong>{item.gold.total.toLocaleString()}g</strong>
        </div>
      </div>
    </article>
  );
}
