import { useEffect, useMemo, useState } from "react"
import { FilterButton } from "../components/FilterButton"
import { LoadingState } from "../components/LoadingState"
import { SearchBar } from "../components/SearchBar"
import { fetchItems, getVersion, ITEM_CATEGORIES, itemImage } from "../services/ddragon"
import type { Item, ItemCategory } from "../types/league"

const categoryLabels: Record<ItemCategory, string> = {
  Starter: "Starter Relics",
  Boots: "Enchanted Boots",
  Basic: "Basic Components",
  Epic: "Epic Artifacts",
  Legendary: "Legendary Artifacts",
  Consumable: "Consumables",
  Trinket: "Trinkets",
  Other: "Other",
}

const categoryHints: Record<ItemCategory, string> = {
  Starter: "Cheap items for the opening minutes",
  Boots: "Movement & utility footwear",
  Basic: "Single-tag components",
  Epic: "Mid-tier components",
  Legendary: "Top-of-build power spikes",
  Consumable: "One-shot effects",
  Trinket: "Vision & utility",
  Other: "Misc",
}

type ActiveCategory = ItemCategory | "All"

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [version, setVersion] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("All")

  useEffect(() => {
    let shouldUpdate = true

    async function loadItems() {
      try {
        const [loadedItems, loadedVersion] = await Promise.all([fetchItems(), getVersion()])

        if (shouldUpdate) {
          setItems(loadedItems)
          setVersion(loadedVersion)
          setError("")
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to open the item archive.")
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      }
    }

    loadItems()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const groupedItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const groups = ITEM_CATEGORIES.reduce(
      (currentGroups, category) => ({
        ...currentGroups,
        [category]: [] as Item[],
      }),
      {} as Record<ItemCategory, Item[]>,
    )

    for (const item of items) {
      if (query && !item.name.toLowerCase().includes(query)) {
        continue
      }

      if (item.category in groups) {
        groups[item.category].push(item)
      }
    }

    for (const category of ITEM_CATEGORIES) {
      groups[category].sort((firstItem, secondItem) => {
        if (category === "Legendary" || category === "Epic") {
          return secondItem.gold.total - firstItem.gold.total
        }

        return firstItem.gold.total - secondItem.gold.total
      })
    }

    return groups
  }, [items, search])

  const totalVisibleItems = useMemo(() => {
    return ITEM_CATEGORIES.reduce((total, category) => total + groupedItems[category].length, 0)
  }, [groupedItems])

  const visibleCategories = activeCategory === "All" ? ITEM_CATEGORIES : [activeCategory]

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Artifacts</h1>
        <p>{totalVisibleItems} relics of power</p>
      </header>

      <section className="filters-panel filters-panel--compact" aria-label="Item filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Search for an artifact..." />
        <div className="filter-row">
          <FilterButton active={activeCategory === "All"} onClick={() => setActiveCategory("All")}>
            All
          </FilterButton>
          {ITEM_CATEGORIES.map((category) => (
            <FilterButton
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              count={groupedItems[category].length}
            >
              {categoryLabels[category]}
            </FilterButton>
          ))}
        </div>
      </section>

      {isLoading && <LoadingState label="Opening the artifact archive..." />}

      {error && !isLoading && (
        <div className="empty-state">
          <h2>Archive unavailable</h2>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && totalVisibleItems === 0 && (
        <div className="empty-state">
          <h2>No artifacts match your search.</h2>
          <p>Try another name or category.</p>
        </div>
      )}

      {!isLoading && !error && totalVisibleItems > 0 && (
        <div className="item-sections">
          {visibleCategories.map((category) => {
            const categoryItems = groupedItems[category]

            if (categoryItems.length === 0) {
              return null
            }

            return (
              <section key={category} className="item-section">
                <div className="section-heading">
                  <div>
                    <h2>{categoryLabels[category]}</h2>
                    <p>{categoryHints[category]}</p>
                  </div>
                  <span>
                    {categoryItems.length} {categoryItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="items-grid">
                  {categoryItems.map((item) => (
                    <article key={item.id} className="item-card">
                      {version ? (
                        <img
                          src={itemImage(version, item.image.full)}
                          alt={item.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.classList.add("item-card__image--missing")
                          }}
                        />
                      ) : (
                        <span className="item-card__image-placeholder" />
                      )}
                      <div className="item-card__content">
                        <h3>{item.name}</h3>
                        <p>{item.plaintext || item.tags.slice(0, 3).join(" · ")}</p>
                        <strong>{item.gold.total.toLocaleString()}g</strong>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
