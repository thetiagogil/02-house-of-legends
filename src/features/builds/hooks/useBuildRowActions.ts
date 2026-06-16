import { useState } from "react";
import { deleteBuild, updateBuild } from "../storage/build-storage";
import type { Build } from "../types";

type UseBuildRowActionsInput = {
  build: Build;
  onChange: () => void;
};

export const useBuildRowActions = ({
  build,
  onChange,
}: UseBuildRowActionsInput) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showRecordControls, setShowRecordControls] = useState(false);

  const changeWins = (delta: number) => {
    if (updateBuild(build.id, { win: Math.max(0, build.win + delta) })) {
      onChange();
    }
  };

  const changeLosses = (delta: number) => {
    if (updateBuild(build.id, { loss: Math.max(0, build.loss + delta) })) {
      onChange();
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deleteBuild(build.id)) {
      onChange();
    }
  };

  const toggleRecordControls = () => {
    setShowRecordControls((currentValue) => !currentValue);
  };

  return {
    changeLosses,
    changeWins,
    closeDeleteDialog,
    confirmDelete,
    isDeleteDialogOpen,
    openDeleteDialog,
    showRecordControls,
    toggleRecordControls,
  };
};
