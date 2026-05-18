import { itemImage } from "../lib/item-images";
import type { Item } from "../types";

type ItemCardProps = {
  item: Item;
  version: string;
};

export function ItemCard({ item, version }: ItemCardProps) {
  const detail = item.plaintext || item.tags.slice(0, 3).join(" / ");

  return (
    <article className="item-card item-card--browser">
      {version ? (
        <img
          src={itemImage(version, item.image.full)}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.classList.add("item-card__image--missing");
          }}
        />
      ) : (
        <span className="item-card__image-placeholder" />
      )}
      <div className="item-card__content">
        <h3>{item.name}</h3>
        <p title={detail}>{detail}</p>
        <div className="item-card__meta">
          <span>{item.category}</span>
          <strong>{item.gold.total.toLocaleString()}g</strong>
        </div>
      </div>
    </article>
  );
}
