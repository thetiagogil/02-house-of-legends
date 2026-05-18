import type { Dispatch, SetStateAction } from "react";
import type { PickerTarget } from "../lib/build-form-options";
import type { ChampionSummary } from "../../champions/types";
import { BuildChampionButton } from "./BuildChampionButton";
import { FormField } from "./FormField";

type BuildCorePanelProps = {
  pickerTarget: PickerTarget;
  selectedChampion: ChampionSummary | null;
  setPickerTarget: Dispatch<SetStateAction<PickerTarget>>;
  setTitle: (title: string) => void;
  title: string;
};

export function BuildCorePanel({
  pickerTarget,
  selectedChampion,
  setPickerTarget,
  setTitle,
  title,
}: BuildCorePanelProps) {
  return (
    <div className="forge-panel">
      <div className="section-heading">
        <div>
          <h2>Core</h2>
          <p>Champion and build title</p>
        </div>
        <span>{selectedChampion ? "Ready" : "Required"}</span>
      </div>

      <div className="forge-fields forge-fields--single">
        <FormField label="Build Title" htmlFor="build-title">
          <input
            id="build-title"
            type="text"
            required
            maxLength={24}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Crit spellblade"
          />
          <span className="field-hint">{title.length}/24</span>
        </FormField>

        <BuildChampionButton
          champion={selectedChampion}
          isActive={pickerTarget.type === "champion"}
          onSelect={() => setPickerTarget({ type: "champion" })}
        />
      </div>
    </div>
  );
}
