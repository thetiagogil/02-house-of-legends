import { Link } from "react-router-dom";
import { championImages } from "../../../features/champions/lib/champion-images";

type HomeTileProps = {
  championId: string;
  index: number;
  subtitle: string;
  title: string;
  to: string;
};

export function HomeTile({
  championId,
  index,
  subtitle,
  title,
  to,
}: HomeTileProps) {
  const imageUrl = championImages.centered(championId);

  return (
    <Link to={to} className="home-tile">
      <span
        className="home-tile__image"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <span
        className="home-tile__image home-tile__image--hover"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <span className="home-tile__shade" />
      <span className="home-tile__content">
        <span className="home-tile__chapter">
          Chapter {String(index + 1).padStart(2, "0")}
        </span>
        <span className="home-tile__title">{title}</span>
        <span className="home-tile__subtitle">{subtitle}</span>
      </span>
    </Link>
  );
}
