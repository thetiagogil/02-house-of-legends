import { useEffect, useState } from "react";
import { BUILD_STORAGE_EVENT, readBuilds } from "../storage/build-storage";
import type { Build } from "../types";

export const useBuilds = () => {
  const [builds, setBuilds] = useState<Build[]>(() => readBuilds());

  useEffect(() => {
    const refreshStoredBuilds = () => {
      setBuilds(readBuilds());
    };

    window.addEventListener(BUILD_STORAGE_EVENT, refreshStoredBuilds);
    window.addEventListener("storage", refreshStoredBuilds);

    return () => {
      window.removeEventListener(BUILD_STORAGE_EVENT, refreshStoredBuilds);
      window.removeEventListener("storage", refreshStoredBuilds);
    };
  }, []);

  const refreshBuilds = () => {
    setBuilds(readBuilds());
  };

  return { builds, refreshBuilds };
};
