import { BuildGroupList } from "../../features/builds/components/BuildGroupList";
import { useBuildBrowser } from "../../features/builds/hooks/useBuildBrowser";
import { BuildsEmptyState } from "./_components/BuildsEmptyState";
import { BuildSortControls } from "./_components/BuildSortControls";
import { BuildsToolbar } from "./_components/BuildsToolbar";

export function BuildsPage() {
  const {
    builds,
    groupedBuilds,
    refreshBuilds,
    search,
    setSearch,
    sort,
    setSort,
    version,
    visibleBuilds,
  } = useBuildBrowser();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Builds</h1>
        <p>
          {builds.length} saved {builds.length === 1 ? "build" : "builds"}
        </p>
      </header>

      <BuildsToolbar search={search} onSearchChange={setSearch} />

      {builds.length > 0 && (
        <BuildSortControls sort={sort} onSortChange={setSort} />
      )}

      {builds.length === 0 && <BuildsEmptyState />}

      {builds.length > 0 && visibleBuilds.length === 0 && (
        <div className="empty-state">
          <h2>No builds match your search.</h2>
          <p>Try another champion or title.</p>
        </div>
      )}

      {visibleBuilds.length > 0 && (
        <BuildGroupList
          groups={groupedBuilds}
          version={version}
          onChange={refreshBuilds}
        />
      )}
    </div>
  );
}
