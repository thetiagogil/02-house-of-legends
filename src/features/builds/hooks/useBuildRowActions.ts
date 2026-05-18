import { useState } from "react";
import { deleteBuild, updateBuild } from "../storage/build-storage";
import type { Build } from "../types";

type UseBuildRowActionsInput = {
  build: Build;
  onChange: () => void;
};

export function useBuildRowActions({
  build,
  onChange,
}: UseBuildRowActionsInput) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showRecordControls, setShowRecordControls] = useState(false);

  function changeWins(delta: number) {
    updateBuild(build.id, { win: Math.max(0, build.win + delta) });
    onChange();
  }

  function changeLosses(delta: number) {
    updateBuild(build.id, { loss: Math.max(0, build.loss + delta) });
    onChange();
  }

  function handleDelete() {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    deleteBuild(build.id);
    onChange();
  }

  function hideDeleteConfirmation() {
    setIsConfirmingDelete(false);
  }

  function toggleRecordControls() {
    setShowRecordControls((currentValue) => !currentValue);
  }

  return {
    changeLosses,
    changeWins,
    handleDelete,
    hideDeleteConfirmation,
    isConfirmingDelete,
    showRecordControls,
    toggleRecordControls,
  };
}
