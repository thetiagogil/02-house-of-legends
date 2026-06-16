import { Icon } from "../../../shared/components/ui/Icon";
import { itemImage } from "../../items/lib/item-images";
import type { Item } from "../../items/types";

type BuildSlotButtonProps = {
  slotIndex: number;
  item: Item | null;
  version: string;
  isActive: boolean;
  onSelect: () => void;
  onClear: () => void;
};

export const BuildSlotButton = ({
  slotIndex,
  item,
  version,
  isActive,
  onSelect,
  onClear,
}: BuildSlotButtonProps) => {
  const slotLabel = slotIndex === 0 ? "Boots" : `Item ${slotIndex}`;

  return (
    <div
      className={
        isActive ? "build-slot-tile build-slot-tile--active" : "build-slot-tile"
      }
    >
      <button
        type="button"
        onClick={onSelect}
        className="build-slot-tile__button"
      >
        <span className="build-slot-tile__index">{slotIndex + 1}</span>
        {item && version ? (
          <img src={itemImage(version, item.image.full)} alt="" />
        ) : (
          <span className="build-slot-tile__placeholder" />
        )}
        <span className="build-slot-tile__content">
          <span>{item?.name ?? slotLabel}</span>
          <small>
            {item ? `${item.gold.total.toLocaleString()}g` : "Choose"}
          </small>
        </span>
      </button>
      {item && (
        <button
          type="button"
          onClick={onClear}
          className="build-slot-tile__clear"
          aria-label={`Clear ${slotLabel}`}
        >
          <Icon name="minus" size={14} />
        </button>
      )}
    </div>
  );
};
