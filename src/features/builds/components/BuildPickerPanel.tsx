import type { BuildFormState } from "../hooks/useBuildForm";
import { BuildChampionPicker } from "./BuildChampionPicker";
import { BuildItemPicker } from "./BuildItemPicker";

type BuildPickerPanelProps = {
  form: BuildFormState;
};

export const BuildPickerPanel = ({ form }: BuildPickerPanelProps) => {
  const pickerTarget = form.pickerTarget;

  return (
    <aside className="picker-panel" aria-label="Build picker">
      {pickerTarget.type === "champion" ? (
        <BuildChampionPicker
          champions={form.champions}
          selectedChampionId={form.championId}
          roles={form.championRoles}
          search={form.championSearch}
          role={form.championRole}
          onSearchChange={form.setChampionSearch}
          onRoleChange={form.setChampionRole}
          onSelect={form.selectChampion}
        />
      ) : (
        <BuildItemPicker
          items={pickerTarget.slotIndex === 0 ? form.boots : form.artifacts}
          selectedItemIds={form.selectedItemIds}
          currentItemId={form.slots[pickerTarget.slotIndex]}
          slotIndex={pickerTarget.slotIndex}
          search={form.itemSearch}
          artifactCategory={form.artifactCategory}
          version={form.version}
          onSearchChange={form.setItemSearch}
          onArtifactCategoryChange={form.setArtifactCategory}
          onSelect={form.selectItem}
          onClear={() => form.setSlot(pickerTarget.slotIndex, "")}
        />
      )}
    </aside>
  );
};
