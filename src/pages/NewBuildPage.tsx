import type { FormEvent, ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FilterButton } from "../components/FilterButton"
import { HouseBadge } from "../components/HouseBadge"
import { Icon } from "../components/Icon"
import { LoadingState } from "../components/LoadingState"
import { RegionBadge } from "../components/RegionBadge"
import { SearchBar } from "../components/SearchBar"
import { createBuild } from "../services/buildStorage"
import { championImages, fetchChampions, fetchItems, getVersion, itemImage } from "../services/ddragon"
import type { ChampionSummary, Item, ItemCategory } from "../types/league"

const EMPTY_SLOTS = ["", "", "", "", "", ""]
const SLOT_INDEXES = [0, 1, 2, 3, 4, 5]
const ARTIFACT_CATEGORIES: Array<ItemCategory | "All"> = ["All", "Legendary", "Epic"]

type PickerTarget = { type: "champion" } | { type: "item"; slotIndex: number }

export function NewBuildPage() {
  const navigate = useNavigate()
  const [champions, setChampions] = useState<ChampionSummary[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [version, setVersion] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [championId, setChampionId] = useState("")
  const [title, setTitle] = useState("")
  const [slots, setSlots] = useState(() => [...EMPTY_SLOTS])
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>({ type: "champion" })
  const [championSearch, setChampionSearch] = useState("")
  const [championRole, setChampionRole] = useState("All")
  const [itemSearch, setItemSearch] = useState("")
  const [artifactCategory, setArtifactCategory] = useState<ItemCategory | "All">("All")

  useEffect(() => {
    let shouldUpdate = true

    async function loadFormData() {
      try {
        const [loadedChampions, loadedItems, loadedVersion] = await Promise.all([fetchChampions(), fetchItems(), getVersion()])

        if (shouldUpdate) {
          setChampions(loadedChampions)
          setItems(loadedItems)
          setVersion(loadedVersion)
          setError("")
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to prepare the forge.")
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      }
    }

    loadFormData()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const { boots, artifacts } = useMemo(() => {
    return {
      boots: items.filter((item) => item.category === "Boots").sort((firstItem, secondItem) => firstItem.name.localeCompare(secondItem.name)),
      artifacts: items
        .filter((item) => item.category === "Legendary" || item.category === "Epic")
        .sort((firstItem, secondItem) => firstItem.name.localeCompare(secondItem.name)),
    }
  }, [items])

  const championRoles = useMemo(() => {
    return Array.from(new Set(champions.flatMap((champion) => champion.tags))).sort()
  }, [champions])

  const selectedChampion = useMemo(() => {
    return champions.find((champion) => champion.id === championId) ?? null
  }, [championId, champions])

  const selectedItems = useMemo(() => {
    return slots.map((itemId) => items.find((item) => item.id === itemId) ?? null)
  }, [items, slots])

  const selectedItemIds = useMemo(() => {
    return new Set(slots.filter(Boolean))
  }, [slots])

  const completedSlots = selectedItems.filter(Boolean).length
  const totalCost = selectedItems.reduce((total, item) => total + (item?.gold.total ?? 0), 0)
  const isValid = Boolean(selectedChampion && title.trim() && selectedItems.every(Boolean))

  function setSlot(index: number, itemId: string) {
    setSlots((currentSlots) => currentSlots.map((slot, currentIndex) => (currentIndex === index ? itemId : slot)))
  }

  function handleChampionSelect(champion: ChampionSummary) {
    setChampionId(champion.id)
    setPickerTarget({ type: "item", slotIndex: 0 })
  }

  function handleItemSelect(item: Item) {
    if (pickerTarget.type !== "item") {
      return
    }

    const currentValue = slots[pickerTarget.slotIndex]

    if (selectedItemIds.has(item.id) && currentValue !== item.id) {
      return
    }

    setSlot(pickerTarget.slotIndex, item.id)

    const nextEmptySlot = slots.findIndex((slot, index) => index > pickerTarget.slotIndex && !slot)

    if (nextEmptySlot >= 0) {
      setPickerTarget({ type: "item", slotIndex: nextEmptySlot })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValid || !selectedChampion) {
      return
    }

    const selectedBuildItems = selectedItems.flatMap((item) => {
      if (!item) {
        return []
      }

      return {
        id: item.id,
        name: item.name,
        price: item.gold.total,
      }
    })

    if (selectedBuildItems.length !== EMPTY_SLOTS.length) {
      return
    }

    createBuild({
      title: title.trim(),
      champion: {
        id: selectedChampion.id,
        name: selectedChampion.name,
        key: selectedChampion.key,
      },
      items: selectedBuildItems,
    })

    navigate("/builds")
  }

  if (isLoading) {
    return <LoadingState label="Preparing the forge..." />
  }

  if (error) {
    return (
      <div className="page-container page-container--form">
        <div className="empty-state">
          <h2>The forge is unavailable.</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container page-container--form">
      <header className="page-header">
        <h1>Forge a Build</h1>
        <p>
          {completedSlots} of {EMPTY_SLOTS.length} slots ready
        </p>
      </header>

      <form onSubmit={handleSubmit} className="build-create-form">
        <section className="build-forge build-forge--picker">
          <div className="build-form">
            <div className="forge-panel">
              <div className="section-heading">
                <div>
                  <h2>Core</h2>
                  <p>Champion and build title</p>
                </div>
                <span>{selectedChampion ? "Ready" : "Required"}</span>
              </div>

              <div className="forge-fields forge-fields--single">
                <Field label="Build Title" htmlFor="build-title">
                  <input
                    id="build-title"
                    type="text"
                    required
                    maxLength={24}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Crit spellblade"
                  />
                  <span className="field-hint">{title.length}/24</span>
                </Field>

                <button
                  type="button"
                  className={pickerTarget.type === "champion" ? "champion-build-button champion-build-button--active" : "champion-build-button"}
                  onClick={() => setPickerTarget({ type: "champion" })}
                >
                  {selectedChampion ? (
                    <img src={championImages.tile(selectedChampion.id)} alt="" />
                  ) : (
                    <span className="champion-build-button__placeholder" />
                  )}
                  <span className="champion-build-button__content">
                    <span className="champion-build-button__title-row">
                      <span>{selectedChampion?.name ?? "Choose Champion"}</span>
                      {selectedChampion && (
                        <span className="champion-build-button__badges">
                          <HouseBadge house={selectedChampion.house} />
                          <RegionBadge region={selectedChampion.region} />
                        </span>
                      )}
                    </span>
                    <small>{selectedChampion?.title ?? "Open the champion picker"}</small>
                  </span>
                </button>
              </div>
            </div>

            <div className="forge-panel">
              <div className="section-heading">
                <div>
                  <h2>Loadout</h2>
                  <p>One pair of boots / five artifacts</p>
                </div>
                <span>
                  {completedSlots}/{EMPTY_SLOTS.length}
                </span>
              </div>

              <div className="build-slot-grid">
                {SLOT_INDEXES.map((slotIndex) => (
                  <BuildSlotButton
                    key={slotIndex}
                    slotIndex={slotIndex}
                    item={selectedItems[slotIndex]}
                    version={version}
                    isActive={pickerTarget.type === "item" && pickerTarget.slotIndex === slotIndex}
                    onSelect={() => setPickerTarget({ type: "item", slotIndex })}
                    onClear={() => setSlot(slotIndex, "")}
                  />
                ))}
              </div>

              <div className="builder-summary">
                <BuildMetric label="Slots" value={`${completedSlots}/${EMPTY_SLOTS.length}`} />
                <BuildMetric label="Total Cost" value={`${totalCost.toLocaleString()}g`} />
              </div>
            </div>
          </div>

          <aside className="picker-panel" aria-label="Build picker">
            {pickerTarget.type === "champion" ? (
              <ChampionPicker
                champions={champions}
                selectedChampionId={championId}
                roles={championRoles}
                search={championSearch}
                role={championRole}
                onSearchChange={setChampionSearch}
                onRoleChange={setChampionRole}
                onSelect={handleChampionSelect}
              />
            ) : (
              <ItemPicker
                items={pickerTarget.slotIndex === 0 ? boots : artifacts}
                selectedItemIds={selectedItemIds}
                currentItemId={slots[pickerTarget.slotIndex]}
                slotIndex={pickerTarget.slotIndex}
                search={itemSearch}
                artifactCategory={artifactCategory}
                version={version}
                onSearchChange={setItemSearch}
                onArtifactCategoryChange={setArtifactCategory}
                onSelect={handleItemSelect}
                onClear={() => setSlot(pickerTarget.slotIndex, "")}
              />
            )}
          </aside>
        </section>

        <div className="form-actions form-actions--build-create">
          <Link to="/builds" className="muted-action">
            <Icon name="chevron-left" size={16} />
            Cancel
          </Link>
          <button type="submit" disabled={!isValid} className="primary-action">
            Create Build
          </button>
        </div>
      </form>
    </div>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
}

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor} className="field__label">
        {label}
      </label>
      {children}
    </div>
  )
}

type BuildMetricProps = {
  label: string
  value: string
}

function BuildMetric({ label, value }: BuildMetricProps) {
  return (
    <div className="forge-stat">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  )
}

type BuildSlotButtonProps = {
  slotIndex: number
  item: Item | null
  version: string
  isActive: boolean
  onSelect: () => void
  onClear: () => void
}

function BuildSlotButton({ slotIndex, item, version, isActive, onSelect, onClear }: BuildSlotButtonProps) {
  const slotLabel = slotIndex === 0 ? "Boots" : `Item ${slotIndex}`

  return (
    <div className={isActive ? "build-slot-tile build-slot-tile--active" : "build-slot-tile"}>
      <button type="button" onClick={onSelect} className="build-slot-tile__button">
        <span className="build-slot-tile__index">{slotIndex + 1}</span>
        {item && version ? (
          <img src={itemImage(version, item.image.full)} alt="" />
        ) : (
          <span className="build-slot-tile__placeholder" />
        )}
        <span className="build-slot-tile__content">
          <span>{item?.name ?? slotLabel}</span>
          <small>{item ? `${item.gold.total.toLocaleString()}g` : "Choose"}</small>
        </span>
      </button>
      {item && (
        <button type="button" onClick={onClear} className="build-slot-tile__clear" aria-label={`Clear ${slotLabel}`}>
          <Icon name="minus" size={14} />
        </button>
      )}
    </div>
  )
}

type ChampionPickerProps = {
  champions: ChampionSummary[]
  selectedChampionId: string
  roles: string[]
  search: string
  role: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onSelect: (champion: ChampionSummary) => void
}

function ChampionPicker({ champions, selectedChampionId, roles, search, role, onSearchChange, onRoleChange, onSelect }: ChampionPickerProps) {
  const filteredChampions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return champions.filter((champion) => {
      if (query && !champion.name.toLowerCase().includes(query)) {
        return false
      }

      if (role !== "All" && !champion.tags.includes(role)) {
        return false
      }

      return true
    })
  }, [champions, role, search])

  return (
    <>
      <div className="picker-panel__header">
        <div>
          <h2>Choose Champion</h2>
          <p>{filteredChampions.length} available legends</p>
        </div>
      </div>

      <SearchBar value={search} onChange={onSearchChange} placeholder="Search champions..." />

      <div className="filter-row picker-filter-row">
        <FilterButton active={role === "All"} onClick={() => onRoleChange("All")}>
          All
        </FilterButton>
        {roles.map((currentRole) => (
          <FilterButton key={currentRole} active={role === currentRole} onClick={() => onRoleChange(currentRole)}>
            {currentRole}
          </FilterButton>
        ))}
      </div>

      <div className="champion-picker-grid">
        {filteredChampions.map((champion) => (
          <button
            key={champion.id}
            type="button"
            onClick={() => onSelect(champion)}
            className={selectedChampionId === champion.id ? "champion-picker-card champion-picker-card--active" : "champion-picker-card"}
          >
            <img src={championImages.tile(champion.id)} alt="" loading="lazy" />
            <span>
              <strong>{champion.name}</strong>
              <small>{champion.tags.join(" / ")}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

type ItemPickerProps = {
  items: Item[]
  selectedItemIds: Set<string>
  currentItemId: string
  slotIndex: number
  search: string
  artifactCategory: ItemCategory | "All"
  version: string
  onSearchChange: (value: string) => void
  onArtifactCategoryChange: (value: ItemCategory | "All") => void
  onSelect: (item: Item) => void
  onClear: () => void
}

function ItemPicker({
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
}: ItemPickerProps) {
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items
      .filter((item) => {
        if (query && !item.name.toLowerCase().includes(query)) {
          return false
        }

        if (slotIndex > 0 && artifactCategory !== "All" && item.category !== artifactCategory) {
          return false
        }

        return true
      })
      .sort((firstItem, secondItem) => firstItem.name.localeCompare(secondItem.name))
  }, [artifactCategory, items, search, slotIndex])

  return (
    <>
      <div className="picker-panel__header">
        <div>
          <h2>{slotIndex === 0 ? "Choose Boots" : `Choose Item ${slotIndex}`}</h2>
          <p>{filteredItems.length} matching artifacts</p>
        </div>
        {currentItemId && (
          <button type="button" onClick={onClear} className="muted-action picker-panel__clear">
            Clear
          </button>
        )}
      </div>

      <SearchBar value={search} onChange={onSearchChange} placeholder="Search items..." />

      {slotIndex > 0 && (
        <div className="filter-row picker-filter-row">
          {ARTIFACT_CATEGORIES.map((category) => (
            <FilterButton key={category} active={artifactCategory === category} onClick={() => onArtifactCategoryChange(category)}>
              {category}
            </FilterButton>
          ))}
        </div>
      )}

      <div className="item-picker-list">
        {filteredItems.map((item) => {
          const isActive = currentItemId === item.id
          const isTaken = selectedItemIds.has(item.id) && !isActive

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              disabled={isTaken}
              className={isActive ? "item-picker-card item-picker-card--active" : "item-picker-card"}
            >
              {version ? <img src={itemImage(version, item.image.full)} alt="" loading="lazy" /> : <span className="item-picker-card__placeholder" />}
              <span className="item-picker-card__content">
                <strong>{item.name}</strong>
                <small>{item.plaintext || item.tags.slice(0, 3).join(" / ")}</small>
              </span>
              <span className="item-picker-card__price">{item.gold.total.toLocaleString()}g</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
