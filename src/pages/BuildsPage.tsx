import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FilterButton } from "../components/FilterButton"
import { Icon } from "../components/Icon"
import { SearchBar } from "../components/SearchBar"
import { calculateWinRate, deleteBuild, getWinRateClass, readBuilds, updateBuild } from "../services/buildStorage"
import { championImages, getVersion, itemImage } from "../services/ddragon"
import type { Build } from "../types/league"

type BuildSort = "Newest" | "Champion" | "Win Rate" | "Games" | "Cost"

const SORT_OPTIONS: BuildSort[] = ["Newest", "Champion", "Win Rate", "Games", "Cost"]

export function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>(() => readBuilds())
  const [version, setVersion] = useState("")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<BuildSort>("Newest")

  useEffect(() => {
    function refreshBuilds() {
      setBuilds(readBuilds())
    }

    window.addEventListener("house-of-legends-builds-changed", refreshBuilds)
    window.addEventListener("storage", refreshBuilds)

    return () => {
      window.removeEventListener("house-of-legends-builds-changed", refreshBuilds)
      window.removeEventListener("storage", refreshBuilds)
    }
  }, [])

  useEffect(() => {
    let shouldUpdate = true

    getVersion()
      .then((loadedVersion) => {
        if (shouldUpdate) {
          setVersion(loadedVersion)
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setVersion("")
        }
      })

    return () => {
      shouldUpdate = false
    }
  }, [])

  const visibleBuilds = useMemo(() => {
    const query = search.trim().toLowerCase()

    return builds
      .filter((build) => {
        if (!query) {
          return true
        }

        return build.title.toLowerCase().includes(query) || build.champion.name.toLowerCase().includes(query)
      })
      .sort((firstBuild, secondBuild) => {
        if (sort === "Champion") {
          return firstBuild.champion.name.localeCompare(secondBuild.champion.name)
        }

        if (sort === "Win Rate") {
          return calculateWinRate(secondBuild) - calculateWinRate(firstBuild)
        }

        if (sort === "Games") {
          return secondBuild.win + secondBuild.loss - (firstBuild.win + firstBuild.loss)
        }

        if (sort === "Cost") {
          return getBuildCost(secondBuild) - getBuildCost(firstBuild)
        }

        return secondBuild.createdAt - firstBuild.createdAt
      })
  }, [builds, search, sort])

  const groupedBuilds = useMemo(() => {
    const groups = new Map<string, Build[]>()

    visibleBuilds.forEach((build) => {
      const currentBuilds = groups.get(build.champion.id) ?? []
      groups.set(build.champion.id, [...currentBuilds, build])
    })

    return Array.from(groups.entries())
      .map(([championId, championBuilds]) => ({
        championId,
        champion: championBuilds[0].champion,
        builds: championBuilds,
      }))
      .sort((firstGroup, secondGroup) => firstGroup.champion.name.localeCompare(secondGroup.champion.name))
  }, [visibleBuilds])

  function refreshBuilds() {
    setBuilds(readBuilds())
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Builds</h1>
        <p>
          {builds.length} saved {builds.length === 1 ? "build" : "builds"}
        </p>
      </header>

      <section className="build-toolbar build-toolbar--cards">
        <SearchBar value={search} onChange={setSearch} placeholder="Search champion or build..." />
        <Link to="/builds/new" aria-label="Create build" className="round-action">
          <Icon name="plus" />
        </Link>
      </section>

      {builds.length > 0 && (
        <div className="filter-row build-sort-row">
          {SORT_OPTIONS.map((option) => (
            <FilterButton key={option} active={sort === option} onClick={() => setSort(option)}>
              {option}
            </FilterButton>
          ))}
        </div>
      )}

      {builds.length === 0 && (
        <div className="empty-state empty-state--large">
          <h2>No builds forged yet.</h2>
          <Link to="/builds/new" className="primary-action">
            Forge your first build
          </Link>
        </div>
      )}

      {builds.length > 0 && visibleBuilds.length === 0 && (
        <div className="empty-state">
          <h2>No builds match your search.</h2>
          <p>Try another champion or title.</p>
        </div>
      )}

      {visibleBuilds.length > 0 && (
        <div className="build-groups">
          {groupedBuilds.map((group) => (
            <BuildGroup key={group.championId} champion={group.champion} builds={group.builds} version={version} onChange={refreshBuilds} />
          ))}
        </div>
      )}
    </div>
  )
}

function getBuildCost(build: Build): number {
  return build.items.reduce((total, item) => total + item.price, 0)
}

type BuildCardProps = {
  build: Build
  version: string
  onChange: () => void
}

type BuildGroupProps = {
  champion: Build["champion"]
  builds: Build[]
  version: string
  onChange: () => void
}

function BuildGroup({ champion, builds, version, onChange }: BuildGroupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const totalGames = builds.reduce((total, build) => total + build.win + build.loss, 0)

  return (
    <article className="build-group">
      <button type="button" className="build-group__header" onClick={() => setIsOpen((currentValue) => !currentValue)} aria-expanded={isOpen}>
        <img src={championImages.tile(champion.id)} alt="" />
        <div className="build-group__title">
          <span>{champion.name}</span>
          <small>
            <strong>{builds.length}</strong> {builds.length === 1 ? "build" : "builds"} / {totalGames} games
          </small>
        </div>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="build-group__icon" />
      </button>

      {isOpen && (
        <div className="build-group__rows">
          {builds.map((build) => (
            <BuildRow key={build.id} build={build} version={version} onChange={onChange} />
          ))}
        </div>
      )}
    </article>
  )
}

function BuildRow({ build, version, onChange }: BuildCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [showRecordControls, setShowRecordControls] = useState(false)
  const games = build.win + build.loss
  const rate = calculateWinRate(build)
  const totalCost = getBuildCost(build)

  function changeWins(delta: number) {
    updateBuild(build.id, { win: Math.max(0, build.win + delta) })
    onChange()
  }

  function changeLosses(delta: number) {
    updateBuild(build.id, { loss: Math.max(0, build.loss + delta) })
    onChange()
  }

  function handleDelete() {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteBuild(build.id)
    onChange()
  }

  return (
    <div className="build-row">
      <div className="build-row__summary">
        <div className="build-row__title">
          <h3>{build.title}</h3>
          <small>{new Date(build.createdAt).toLocaleDateString()}</small>
        </div>

        <div className="build-row__items">
          {build.items.map((item, index) =>
            version ? (
              <img key={`${item.id}-${index}`} src={itemImage(version, `${item.id}.png`)} alt={item.name} title={item.name} loading="lazy" />
            ) : (
              <span key={`${item.id}-${index}`} className="build-row__item-placeholder" title={item.name} />
            ),
          )}
        </div>

        <div className="build-row__stats">
          <BuildStat label="Cost" value={`${totalCost.toLocaleString()}g`} />
          <BuildStat label="Record" value={`${build.win}W / ${build.loss}L`} />
          <div className="build-stat">
            <p>Win Rate</p>
            <strong className={getWinRateClass(rate, games)}>{rate}%</strong>
          </div>
        </div>

        <div className="build-row__actions">
          <button
            type="button"
            onClick={() => setShowRecordControls((currentValue) => !currentValue)}
            className={showRecordControls ? "build-row__icon-action build-row__icon-action--active" : "build-row__icon-action"}
            aria-label={showRecordControls ? "Hide record controls" : "Edit record"}
            title={showRecordControls ? "Hide record controls" : "Edit record"}
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            onMouseLeave={() => setIsConfirmingDelete(false)}
            aria-label="Delete build"
            className={isConfirmingDelete ? "build-row__icon-action danger-action danger-action--confirming" : "build-row__icon-action danger-action"}
            title={isConfirmingDelete ? "Click again to confirm" : "Delete"}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {showRecordControls && (
        <div className="build-row__record-edit" aria-label="Edit record">
          <CounterStat label="Wins" value={build.win} onAdd={() => changeWins(1)} onSubtract={() => changeWins(-1)} />
          <CounterStat label="Losses" value={build.loss} onAdd={() => changeLosses(1)} onSubtract={() => changeLosses(-1)} />
        </div>
      )}
    </div>
  )
}

type BuildStatProps = {
  label: string
  value: string | number
}

function BuildStat({ label, value }: BuildStatProps) {
  return (
    <div className="build-stat">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  )
}

type CounterStatProps = {
  label: string
  value: number
  onAdd: () => void
  onSubtract: () => void
}

function CounterStat({ label, value, onAdd, onSubtract }: CounterStatProps) {
  return (
    <div className="build-stat">
      <p>{label}</p>
      <div className="counter-stat">
        <button type="button" onClick={onSubtract} aria-label={`Decrement ${label}`}>
          <Icon name="minus" size={14} />
        </button>
        <strong>{value}</strong>
        <button type="button" onClick={onAdd} aria-label={`Increment ${label}`}>
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  )
}
