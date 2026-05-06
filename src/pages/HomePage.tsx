import { Link } from "react-router-dom"
import { championImages } from "../services/ddragon"

const homeTiles = [
  {
    to: "/champions",
    title: "Champions",
    subtitle: "Discover the heroes of the Rift",
    championId: "Lux",
  },
  {
    to: "/items",
    title: "Items",
    subtitle: "Forge artifacts of immense power",
    championId: "Ornn",
  },
  {
    to: "/builds",
    title: "Builds",
    subtitle: "Craft and master your strategies",
    championId: "Heimerdinger",
  },
]

export function HomePage() {
  return (
    <div className="page-container page-container--home">
      <section className="home-hero">
        <p className="home-hero__kicker">Welcome, Summoner</p>
        <h1 className="home-hero__title">
          House of <span>Legends</span>
        </h1>
        <p className="home-hero__copy">
          Where the magic of the houses meets the fury of the Rift. Browse champions, study artifacts, and forge
          legendary builds.
        </p>
      </section>

      <div className="home-tiles">
        {homeTiles.map((tile, index) => (
          <Link key={tile.to} to={tile.to} className="home-tile">
            <span
              className="home-tile__image"
              style={{ backgroundImage: `url(${championImages.centered(tile.championId)})` }}
            />
            <span
              className="home-tile__image home-tile__image--hover"
              style={{ backgroundImage: `url(${championImages.centered(tile.championId)})` }}
            />
            <span className="home-tile__shade" />
            <span className="home-tile__content">
              <span className="home-tile__chapter">Chapter {String(index + 1).padStart(2, "0")}</span>
              <span className="home-tile__title">{tile.title}</span>
              <span className="home-tile__subtitle">{tile.subtitle}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
