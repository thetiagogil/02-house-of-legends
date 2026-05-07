import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FilterButton } from "../components/FilterButton"
import { HouseBadge } from "../components/HouseBadge"
import { HouseIcon } from "../components/HouseIcon"
import { LoadingState } from "../components/LoadingState"
import { SearchBar } from "../components/SearchBar"
import { HOUSES, houseStyles } from "../data/houses"
import { getRegionLabel } from "../data/regions"
import { championImages, fetchChampions } from "../services/ddragon"
import type { ChampionSummary, House, Region } from "../types/league"

export function ChampionsPage() {
  const [champions, setChampions] = useState<ChampionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string | null>(null)
  const [house, setHouse] = useState<House | null>(null)
  const [region, setRegion] = useState<Region | null>(null)

  useEffect(() => {
    let shouldUpdate = true

    async function loadChampions() {
      try {
        const loadedChampions = await fetchChampions()

        if (shouldUpdate) {
          setChampions(loadedChampions)
          setError("")
        }
      } catch {
        if (shouldUpdate) {
          setError("Failed to summon champions.")
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      }
    }

    loadChampions()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const allRoles = useMemo(() => {
    return Array.from(new Set(champions.flatMap((champion) => champion.tags))).sort()
  }, [champions])

  const allRegions = useMemo(() => {
    return Array.from(new Set(champions.map((champion) => champion.region))).sort((firstRegion, secondRegion) =>
      getRegionLabel(firstRegion).localeCompare(getRegionLabel(secondRegion)),
    ) as Region[]
  }, [champions])

  const filteredChampions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return champions.filter((champion) => {
      if (query && !champion.name.toLowerCase().includes(query)) {
        return false
      }

      if (role && !champion.tags.includes(role)) {
        return false
      }

      if (house && champion.house !== house) {
        return false
      }

      if (region && champion.region !== region) {
        return false
      }

      return true
    })
  }, [champions, house, region, role, search])

  function resetFilters() {
    setRole(null)
    setHouse(null)
    setRegion(null)
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Champions</h1>
        <p>
          {filteredChampions.length} of {champions.length} legends
        </p>
      </header>

      <section className="filters-panel" aria-label="Champion filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Search for a champion..." />

        <div className="filter-row">
          <FilterButton active={!role && !house && !region} onClick={resetFilters}>
            All
          </FilterButton>
          {allRoles.map((currentRole) => (
            <FilterButton
              key={currentRole}
              active={role === currentRole}
              onClick={() => setRole(role === currentRole ? null : currentRole)}
            >
              {currentRole}
            </FilterButton>
          ))}
        </div>

        <details className="region-filter">
          <summary>
            Filter by region
            {region && <span> - {getRegionLabel(region)}</span>}
          </summary>
          <div className="filter-row region-filter__list">
            {allRegions.map((currentRegion) => (
              <FilterButton
                key={currentRegion}
                active={region === currentRegion}
                onClick={() => setRegion(region === currentRegion ? null : currentRegion)}
              >
                {getRegionLabel(currentRegion)}
              </FilterButton>
            ))}
          </div>
        </details>

        <div className="house-grid">
          {HOUSES.map((currentHouse) => {
            const isActive = house === currentHouse
            const houseStyle = houseStyles[currentHouse]

            return (
              <button
                key={currentHouse}
                type="button"
                onClick={() => setHouse(isActive ? null : currentHouse)}
                className={isActive ? `house-card house-card--active ${houseStyle.className}` : `house-card ${houseStyle.className}`}
              >
                <HouseIcon house={currentHouse} className="house-card__sigil" />
                <span className="house-card__name">{currentHouse}</span>
              </button>
            )
          })}
        </div>
      </section>

      {isLoading && <LoadingState />}

      {error && !isLoading && (
        <div className="empty-state">
          <h2>Data portal closed</h2>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && filteredChampions.length === 0 && (
        <div className="empty-state">
          <h2>No legends match your search.</h2>
          <p>Try another name, role, house, or region.</p>
        </div>
      )}

      {!isLoading && !error && filteredChampions.length > 0 && (
        <div className="champions-grid">
          {filteredChampions.map((champion) => (
            <Link key={champion.id} to={`/champions/${champion.id}`} className="champion-card">
              <span className="champion-card__image-wrap">
                <img src={championImages.loading(champion.id)} alt={champion.name} loading="lazy" />
                <span className="champion-card__house">
                  <HouseBadge house={champion.house} />
                </span>
                <span className="champion-card__content">
                  <span className="champion-card__name">{champion.name}</span>
                  <span className="champion-card__title">{champion.title}</span>
                  <span className="champion-card__region">{getRegionLabel(champion.region)}</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
