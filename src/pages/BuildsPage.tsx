import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../components/Icon"
import { SearchBar } from "../components/SearchBar"
import {
  calculateWinRate,
  deleteBuild,
  getWinRateClass,
  readBuilds,
  updateBuild,
} from "../services/buildStorage"
import { championImages, getVersion, itemImage } from "../services/ddragon"
import type { Build } from "../types/league"

export function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>(() => readBuilds())
  const [version, setVersion] = useState("")
  const [search, setSearch] = useState("")

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

  const groupedBuilds = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filteredBuilds = builds.filter((build) => !query || build.champion.name.toLowerCase().includes(query))
    const groups = new Map<string, Build[]>()

    for (const build of filteredBuilds) {
      const currentGroup = groups.get(build.champion.name) ?? []
      groups.set(build.champion.name, [...currentGroup, build])
    }

    return Array.from(groups.entries()).sort((firstGroup, secondGroup) => firstGroup[0].localeCompare(secondGroup[0]))
  }, [builds, search])

  function refreshBuilds() {
    setBuilds(readBuilds())
  }

  return (
    <div className="page-container page-container--narrow">
      <header className="page-header">
        <h1>Builds</h1>
        <p>
          {builds.length} saved {builds.length === 1 ? "build" : "builds"}
        </p>
      </header>

      <section className="build-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search for a build..." />
        <Link to="/builds/new" aria-label="Create build" className="round-action">
          <Icon name="plus" />
        </Link>
      </section>

      {builds.length === 0 && (
        <div className="empty-state empty-state--large">
          <h2>No builds forged yet.</h2>
          <Link to="/builds/new" className="primary-action">
            Forge your first build
          </Link>
        </div>
      )}

      {builds.length > 0 && groupedBuilds.length === 0 && (
        <div className="empty-state">
          <h2>No builds match your search.</h2>
          <p>Try searching for another champion.</p>
        </div>
      )}

      <div className="build-groups">
        {groupedBuilds.map(([championName, championBuilds]) => (
          <ChampionBuildGroup
            key={championName}
            championName={championName}
            championId={championBuilds[0].champion.id}
            builds={championBuilds}
            version={version}
            onChange={refreshBuilds}
          />
        ))}
      </div>
    </div>
  )
}

type ChampionBuildGroupProps = {
  championName: string
  championId: string
  builds: Build[]
  version: string
  onChange: () => void
}

function ChampionBuildGroup({ championName, championId, builds, version, onChange }: ChampionBuildGroupProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section className="build-group">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="build-group__header">
        <img src={championImages.tile(championId)} alt={championName} />
        <span className="build-group__title">
          <span>
            {championName} <strong>Builds</strong>
          </span>
          <small>
            {builds.length} {builds.length === 1 ? "build" : "builds"}
          </small>
        </span>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="build-group__icon" />
      </button>

      {isOpen && (
        <div className="build-group__rows">
          {builds.map((build) => (
            <BuildRow key={build.id} build={build} version={version} onChange={onChange} />
          ))}
        </div>
      )}
    </section>
  )
}

type BuildRowProps = {
  build: Build
  version: string
  onChange: () => void
}

function BuildRow({ build, version, onChange }: BuildRowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const games = build.win + build.loss
  const rate = calculateWinRate(build)
  const totalCost = build.items.reduce((total, item) => total + item.price, 0)

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
    <article className="build-row">
      <div className="build-row__summary">
        <h3>{build.title}</h3>

        <div className="build-row__items">
          {build.items.map((item) =>
            version ? (
              <img key={item.id} src={itemImage(version, `${item.id}.png`)} alt={item.name} title={item.name} />
            ) : (
              <span key={item.id} className="build-row__item-placeholder" title={item.name} />
            ),
          )}
        </div>

        <div className="build-row__actions">
          <span className={getWinRateClass(rate, games)}>{rate}%</span>
          <button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle build details">
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            onMouseLeave={() => setIsConfirmingDelete(false)}
            aria-label="Delete build"
            className={isConfirmingDelete ? "danger-action danger-action--confirming" : "danger-action"}
            title={isConfirmingDelete ? "Click again to confirm" : "Delete"}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="build-row__details">
          <BuildStat label="Total Cost" value={`${totalCost.toLocaleString()}g`} />
          <BuildStat label="Games" value={games} />
          <CounterStat label="Wins" value={build.win} onAdd={() => changeWins(1)} onSubtract={() => changeWins(-1)} />
          <CounterStat label="Losses" value={build.loss} onAdd={() => changeLosses(1)} onSubtract={() => changeLosses(-1)} />
        </div>
      )}
    </article>
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
