import type { FormEvent, ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LoadingState } from "../components/LoadingState"
import { createBuild } from "../services/buildStorage"
import { championImages, fetchChampions, fetchItems, getVersion, itemImage } from "../services/ddragon"
import type { ChampionSummary, Item } from "../types/league"

export function NewBuildPage() {
  const navigate = useNavigate()
  const [champions, setChampions] = useState<ChampionSummary[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [version, setVersion] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [championId, setChampionId] = useState("")
  const [title, setTitle] = useState("")
  const [slots, setSlots] = useState(["", "", "", "", "", ""])

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
        .sort((firstItem, secondItem) => secondItem.gold.total - firstItem.gold.total),
    }
  }, [items])

  const selectedChampion = useMemo(() => {
    return champions.find((champion) => champion.id === championId) ?? null
  }, [championId, champions])

  const totalCost = useMemo(() => {
    return slots.reduce((total, itemId) => total + (items.find((item) => item.id === itemId)?.gold.total ?? 0), 0)
  }, [items, slots])

  const isValid = Boolean(championId && title.trim() && slots.every(Boolean))

  function setSlot(index: number, itemId: string) {
    setSlots((currentSlots) => currentSlots.map((slot, currentIndex) => (currentIndex === index ? itemId : slot)))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValid || !selectedChampion) {
      return
    }

    const selectedItems = slots.map((itemId) => {
      const item = items.find((currentItem) => currentItem.id === itemId)

      if (!item) {
        throw new Error("Selected item was not found.")
      }

      return {
        id: item.id,
        name: item.name,
        price: item.gold.total,
      }
    })

    createBuild({
      title: title.trim(),
      champion: {
        id: selectedChampion.id,
        name: selectedChampion.name,
        key: selectedChampion.key,
      },
      items: selectedItems,
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
        <p>One pair of boots · five artifacts</p>
      </header>

      <form onSubmit={handleSubmit} className="build-form">
        <Field label="Champion">
          <select value={championId} onChange={(event) => setChampionId(event.target.value)} required>
            <option value="">Choose a champion...</option>
            {champions.map((champion) => (
              <option key={champion.id} value={champion.id}>
                {champion.name} — {champion.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Build Title">
          <input
            type="text"
            required
            maxLength={20}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="OP Crit Build"
          />
          <span className="field-hint">{title.length}/20</span>
        </Field>

        <ItemSlot label="Boots (Slot 1)" items={boots} value={slots[0]} onChange={(itemId) => setSlot(0, itemId)} version={version} />

        {[1, 2, 3, 4, 5].map((slotIndex) => (
          <ItemSlot
            key={slotIndex}
            label={`Item ${slotIndex + 1}`}
            items={artifacts}
            value={slots[slotIndex]}
            onChange={(itemId) => setSlot(slotIndex, itemId)}
            disabledIds={slots.filter((_, currentIndex) => currentIndex !== slotIndex && currentIndex !== 0)}
            version={version}
          />
        ))}

        {selectedChampion && (
          <div className="build-preview">
            <img src={championImages.tile(selectedChampion.id)} alt="" />
            <p>
              Forging for <strong>{selectedChampion.name}</strong>
            </p>
            <p className="build-preview__cost">
              <span>Total Cost</span>
              <strong>{totalCost.toLocaleString()}g</strong>
            </p>
          </div>
        )}

        <div className="form-actions">
          <Link to="/builds" className="muted-action">
            ← Cancel
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
  children: ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  )
}

type ItemSlotProps = {
  label: string
  items: Item[]
  value: string
  onChange: (value: string) => void
  disabledIds?: string[]
  version: string
}

function ItemSlot({ label, items, value, onChange, disabledIds = [], version }: ItemSlotProps) {
  const selectedItem = items.find((item) => item.id === value)

  return (
    <Field label={label}>
      <div className="item-slot">
        {selectedItem && version ? (
          <img src={itemImage(version, selectedItem.image.full)} alt="" />
        ) : (
          <span className="item-slot__placeholder" />
        )}
        <select value={value} onChange={(event) => onChange(event.target.value)} required>
          <option value="">Choose...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id} disabled={disabledIds.includes(item.id)}>
              {item.name} ({item.gold.total}g)
            </option>
          ))}
        </select>
      </div>
    </Field>
  )
}
