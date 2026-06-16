import { useState } from "react";
import { useDataDragonVersion } from "../../../shared/hooks/useDataDragonVersion";
import {
  type BuildSort,
  filterBuilds,
  groupBuildsByChampion,
  sortBuilds,
} from "../lib/build-browser";
import { useBuilds } from "./useBuilds";

export const useBuildBrowser = () => {
  const { builds, refreshBuilds } = useBuilds();
  const version = useDataDragonVersion();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<BuildSort>("Newest");
  const visibleBuilds = sortBuilds(filterBuilds(builds, search), sort);
  const groupedBuilds = groupBuildsByChampion(visibleBuilds);

  return {
    builds,
    groupedBuilds,
    refreshBuilds,
    search,
    setSearch,
    sort,
    setSort,
    version,
    visibleBuilds,
  };
};
