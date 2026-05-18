import { Icon } from "../../../shared/components/ui/Icon";
import { getSkinLabel } from "../lib/champion-skins";
import type { ChampionSkin } from "../types";

type ChampionSkinHeroProps = {
  currentSkin?: ChampionSkin;
  skinIndex: number;
  splashImage: string;
  visibleSkins: ChampionSkin[];
  onNextSkin: () => void;
  onPreviousSkin: () => void;
  onSkinSelect: (skinIndex: number) => void;
};

export function ChampionSkinHero({
  currentSkin,
  skinIndex,
  splashImage,
  visibleSkins,
  onNextSkin,
  onPreviousSkin,
  onSkinSelect,
}: ChampionSkinHeroProps) {
  return (
    <section className="skin-hero">
      <img
        src={splashImage}
        alt=""
        className="skin-hero__visual skin-hero__visual--blur"
      />
      <img src={splashImage} alt="" className="skin-hero__visual" />
      <div className="skin-hero__shade" />

      <button
        type="button"
        onClick={onPreviousSkin}
        disabled={skinIndex === 0}
        aria-label="Previous skin"
        className="skin-hero__arrow skin-hero__arrow--left"
      >
        <Icon name="chevron-left" />
      </button>
      <button
        type="button"
        onClick={onNextSkin}
        disabled={skinIndex === visibleSkins.length - 1}
        aria-label="Next skin"
        className="skin-hero__arrow skin-hero__arrow--right"
      >
        <Icon name="chevron-right" />
      </button>

      <div className="skin-hero__controls">
        <p>{getSkinLabel(currentSkin)}</p>
        <div className="skin-dots" aria-label="Champion skins">
          {visibleSkins.map((skin, index) => (
            <button
              key={`${skin.num}-${skin.name}`}
              type="button"
              onClick={() => onSkinSelect(index)}
              aria-label={`Show ${getSkinLabel(skin)}`}
              className={
                skinIndex === index ? "skin-dot skin-dot--active" : "skin-dot"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
