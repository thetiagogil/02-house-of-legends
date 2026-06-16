import { useEffect, useState } from "react";
import { BUILD_STORAGE_EVENT, readBuilds } from "../storage/build-storage";
import type { Build } from "../types";

export const useBuilds = () => {
  const [builds, setBuilds] = useState<Build[]>(() => readBuilds());

  useEffect(() => {
    function refreshBuilds() {
      setBuilds(readBuilds());
    }

    window.addEventListener(BUILD_STORAGE_EVENT, refreshBuilds);
    window.addEventListener("storage", refreshBuilds);

    return () => {
      window.removeEventListener(BUILD_STORAGE_EVENT, refreshBuilds);
      window.removeEventListener("storage", refreshBuilds);
    };
  }, []);

  function refreshBuilds() {
    setBuilds(readBuilds());
  }

  return { builds, refreshBuilds };
};
