import { useState } from "react";
import type { ChampionSummary } from "../../champions/types";
import type { Item, ItemCategory } from "../../items/types";
import {
  EMPTY_BUILD_SLOTS,
  type PickerTarget,
  getBuildItemOptions,
  getBuildTotalCost,
  getChampionRoles,
  getCompletedSlotCount,
  getNextEmptySlot,
  getSelectedBuildItems,
  getSelectedItemIds,
  isBuildFormComplete,
  toBuildItems,
} from "../lib/build-form-options";
import { createBuild, updateBuild } from "../storage/build-storage";
import type { Build } from "../types";
import { useBuildFormData } from "./useBuildFormData";

type UseBuildFormInput = {
  initialBuild?: Build;
  onBuildSaved: () => void;
};

function getInitialSlots(initialBuild: Build | undefined): string[] {
  if (!initialBuild) {
    return [...EMPTY_BUILD_SLOTS];
  }

  return EMPTY_BUILD_SLOTS.map(
    (emptySlot, index) => initialBuild.items[index]?.id ?? emptySlot,
  );
}

export function useBuildForm({
  initialBuild,
  onBuildSaved,
}: UseBuildFormInput) {
  const { champions, error, isLoading, items, version } = useBuildFormData();
  const [championId, setChampionId] = useState(initialBuild?.champion.id ?? "");
  const [title, setTitle] = useState(initialBuild?.title ?? "");
  const [slots, setSlots] = useState(() => getInitialSlots(initialBuild));
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>({
    type: "champion",
  });
  const [championSearch, setChampionSearch] = useState("");
  const [championRole, setChampionRole] = useState("All");
  const [itemSearch, setItemSearch] = useState("");
  const [artifactCategory, setArtifactCategory] = useState<
    ItemCategory | "All"
  >("All");
  const [saveError, setSaveError] = useState("");

  const { boots, artifacts } = getBuildItemOptions(items);
  const championRoles = getChampionRoles(champions);
  const selectedChampion =
    champions.find((champion) => champion.id === championId) ?? null;
  const selectedItems = getSelectedBuildItems(items, slots);
  const selectedItemIds = getSelectedItemIds(slots);
  const completedSlots = getCompletedSlotCount(selectedItems);
  const totalCost = getBuildTotalCost(selectedItems);
  const isValid = isBuildFormComplete(selectedChampion, title, selectedItems);

  function setSlot(index: number, itemId: string) {
    setSlots((currentSlots) =>
      currentSlots.map((slot, currentIndex) =>
        currentIndex === index ? itemId : slot,
      ),
    );
  }

  function selectChampion(champion: ChampionSummary) {
    setChampionId(champion.id);
    setChampionSearch("");
    setPickerTarget({ type: "item", slotIndex: 0 });
  }

  function selectItem(item: Item) {
    if (pickerTarget.type !== "item") {
      return;
    }

    const currentValue = slots[pickerTarget.slotIndex];

    if (selectedItemIds.has(item.id) && currentValue !== item.id) {
      return;
    }

    setSlot(pickerTarget.slotIndex, item.id);
    setItemSearch("");

    const nextEmptySlot = getNextEmptySlot(slots, pickerTarget.slotIndex);

    if (nextEmptySlot >= 0) {
      setPickerTarget({ type: "item", slotIndex: nextEmptySlot });
    }
  }

  function submitBuild() {
    setSaveError("");

    if (!isValid || !selectedChampion) {
      return;
    }

    const selectedBuildItems = toBuildItems(selectedItems);

    if (selectedBuildItems.length !== EMPTY_BUILD_SLOTS.length) {
      return;
    }

    const buildInput = {
      title: title.trim(),
      champion: {
        id: selectedChampion.id,
        name: selectedChampion.name,
        key: selectedChampion.key,
      },
      items: selectedBuildItems,
    };

    const didSave = initialBuild
      ? updateBuild(initialBuild.id, buildInput)
      : Boolean(createBuild(buildInput));

    if (!didSave) {
      setSaveError(
        "Build could not be saved. Check browser storage and try again.",
      );
      return;
    }

    onBuildSaved();
  }

  return {
    artifactCategory,
    artifacts,
    boots,
    championId,
    championRole,
    championRoles,
    champions,
    championSearch,
    completedSlots,
    error,
    isLoading,
    isValid,
    itemSearch,
    pickerTarget,
    saveError,
    selectChampion,
    selectItem,
    selectedChampion,
    selectedItemIds,
    selectedItems,
    setArtifactCategory,
    setChampionRole,
    setChampionSearch,
    setItemSearch,
    setPickerTarget,
    setSlot,
    setTitle,
    slots,
    submitBuild,
    title,
    totalCost,
    version,
  };
}

export type BuildFormState = ReturnType<typeof useBuildForm>;
