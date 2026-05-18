import { homeTiles } from "../_lib/homeTiles";
import { HomeTile } from "./HomeTile";

export function HomeTiles() {
  return (
    <div className="home-tiles">
      {homeTiles.map((tile, index) => (
        <HomeTile
          key={tile.to}
          championId={tile.championId}
          index={index}
          subtitle={tile.subtitle}
          title={tile.title}
          to={tile.to}
        />
      ))}
    </div>
  );
}
