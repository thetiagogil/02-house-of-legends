import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ErrorState } from "../components/ErrorState"
import { HouseBadge } from "../components/HouseBadge"
import { Icon } from "../components/Icon"
import { LoadingState } from "../components/LoadingState"
import { StatBar } from "../components/StatBar"
import { REGION_LABEL } from "../data/regions"
import { championImages, fetchChampion, fetchChampions } from "../services/ddragon"
import type { ChampionDetail, ChampionSummary } from "../types/league"

export function ChampionDetailsPage() {
  const { championId } = useParams()
  const navigate = useNavigate()
  const [champion, setChampion] = useState<ChampionDetail | null>(null)
  const [champions, setChampions] = useState<ChampionSummary[]>([])
  const [skinIndex, setSkinIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let shouldUpdate = true

    async function loadChampion() {
      if (!championId) {
        return
      }

      setIsLoading(true)

      try {
        const [loadedChampion, loadedChampions] = await Promise.all([fetchChampion(championId), fetchChampions()])

        if (shouldUpdate) {
          setChampion(loadedChampion)
          setChampions(loadedChampions)
          setSkinIndex(0)
          setError("")
        }
      } catch {
        if (shouldUpdate) {
          setError("Champion not found.")
          setChampion(null)
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      }
    }

    loadChampion()

    return () => {
      shouldUpdate = false
    }
  }, [championId])

  const { previousChampion, nextChampion } = useMemo(() => {
    const currentIndex = champions.findIndex((currentChampion) => currentChampion.id === championId)

    return {
      previousChampion: currentIndex > 0 ? champions[currentIndex - 1] : null,
      nextChampion: currentIndex >= 0 && currentIndex < champions.length - 1 ? champions[currentIndex + 1] : null,
    }
  }, [championId, champions])

  if (isLoading) {
    return <LoadingState label="Summoning champion..." />
  }

  if (error || !champion) {
    return (
      <div className="page-container">
        <ErrorState title="This realm does not exist." message={error || "Champion not found."} />
        <div className="center-actions">
          <Link to="/champions" className="text-link">
            Back to champions
          </Link>
        </div>
      </div>
    )
  }

  const loadedChampion = champion
  const baseSkins = loadedChampion.skins.filter((skin) => !skin.name.includes("("))
  const visibleSkins = baseSkins.length > 0 ? baseSkins : loadedChampion.skins
  const currentSkin = visibleSkins[skinIndex]
  const splashImage = championImages.splash(loadedChampion.id, currentSkin?.num ?? 0)

  function showPreviousSkin() {
    setSkinIndex((currentIndex) => Math.max(0, currentIndex - 1))
  }

  function showNextSkin() {
    setSkinIndex((currentIndex) => Math.min(visibleSkins.length - 1, currentIndex + 1))
  }

  return (
    <div className="champion-detail">
      <section className="skin-hero">
        <img src={splashImage} alt="" className="skin-hero__visual skin-hero__visual--blur" />
        <img src={splashImage} alt="" className="skin-hero__visual" />
        <div className="skin-hero__shade" />

        <button
          type="button"
          onClick={showPreviousSkin}
          disabled={skinIndex === 0}
          aria-label="Previous skin"
          className="skin-hero__arrow skin-hero__arrow--left"
        >
          <Icon name="chevron-left" />
        </button>
        <button
          type="button"
          onClick={showNextSkin}
          disabled={skinIndex === visibleSkins.length - 1}
          aria-label="Next skin"
          className="skin-hero__arrow skin-hero__arrow--right"
        >
          <Icon name="chevron-right" />
        </button>

        <div className="skin-hero__controls">
          <p>{currentSkin?.name === "default" ? "Classic" : currentSkin?.name}</p>
          <div className="skin-dots" aria-label="Champion skins">
            {visibleSkins.map((skin, index) => (
              <button
                key={`${skin.num}-${skin.name}`}
                type="button"
                onClick={() => setSkinIndex(index)}
                aria-label={`Show ${skin.name === "default" ? "Classic" : skin.name}`}
                className={skinIndex === index ? "skin-dot skin-dot--active" : "skin-dot"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="champion-panel-wrap">
        <div className="champion-panel">
          <div className="champion-panel__header">
            <p>{loadedChampion.title}</p>
            <h1>{loadedChampion.name}</h1>
            <div className="champion-panel__meta">
              <HouseBadge house={loadedChampion.house} size="medium" />
              <span>
                Born of <strong>{REGION_LABEL[loadedChampion.region]}</strong>
              </span>
            </div>
          </div>

          <div className="champion-panel__grid">
            <div>
              <h2 className="detail-label">Roles</h2>
              <div className="role-list">
                {loadedChampion.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <h2 className="detail-label">Stats</h2>
              <div className="stat-list">
                <StatBar label="Attack" value={loadedChampion.info.attack} />
                <StatBar label="Defense" value={loadedChampion.info.defense} />
                <StatBar label="Magic" value={loadedChampion.info.magic} />
                <StatBar label="Difficulty" value={loadedChampion.info.difficulty} />
              </div>
            </div>

            <div className="champion-lore">
              <h2 className="detail-label">Lore</h2>
              <blockquote>{`"${loadedChampion.blurb}"`}</blockquote>

              <h2 className="detail-label detail-label--spaced">Passive</h2>
              <p>
                <strong>{loadedChampion.passive.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="champion-navigation">
          <button
            type="button"
            disabled={!previousChampion}
            onClick={() => previousChampion && navigate(`/champions/${previousChampion.id}`)}
            className="outline-action"
          >
            <Icon name="chevron-left" size={16} />
            {previousChampion?.name ?? "Start"}
          </button>

          <Link to="/champions" className="muted-action">
            All Champions
          </Link>

          <button
            type="button"
            disabled={!nextChampion}
            onClick={() => nextChampion && navigate(`/champions/${nextChampion.id}`)}
            className="outline-action"
          >
            {nextChampion?.name ?? "End"}
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}
