import type { Dispatch, SetStateAction } from "react";
import type { Item } from "../../items/types";
import {
  BUILD_SLOT_INDEXES,
  type PickerTarget,
} from "../lib/build-form-options";
import { BuildMetric } from "./BuildMetric";
import { BuildSlotButton } from "./BuildSlotButton";

type BuildLoadoutPanelProps = {
  completedSlots: number;
  pickerTarget: PickerTarget;
  selectedItems: Array<Item | null>;
  setPickerTarget: Dispatch<SetStateAction<PickerTarget>>;
  setSlot: (index: number, itemId: string) => void;
  totalCost: number;
  version: string;
};

export const BuildLoadoutPanel = ({
  completedSlots,
  pickerTarget,
  selectedItems,
  setPickerTarget,
  setSlot,
  totalCost,
  version,
}: BuildLoadoutPanelProps) => {
  return (
    <div className="forge-panel">
      <div className="section-heading">
        <div>
          <h2>Loadout</h2>
          <p>One pair of boots / five artifacts</p>
        </div>
        <span>
          {completedSlots}/{BUILD_SLOT_INDEXES.length}
        </span>
      </div>

      <div className="build-slot-grid">
        {BUILD_SLOT_INDEXES.map((slotIndex) => (
          <BuildSlotButton
            key={slotIndex}
            slotIndex={slotIndex}
            item={selectedItems[slotIndex]}
            version={version}
            isActive={
              pickerTarget.type === "item" &&
              pickerTarget.slotIndex === slotIndex
            }
            onSelect={() => setPickerTarget({ type: "item", slotIndex })}
            onClear={() => setSlot(slotIndex, "")}
          />
        ))}
      </div>

      <div className="builder-summary">
        <BuildMetric
          label="Slots"
          value={`${completedSlots}/${BUILD_SLOT_INDEXES.length}`}
        />
        <BuildMetric
          label="Total Cost"
          value={`${totalCost.toLocaleString()}g`}
        />
      </div>
    </div>
  );
};
