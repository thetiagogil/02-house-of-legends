import { ChampionFilterPanel } from "../../features/champions/components/ChampionFilterPanel";
import { ChampionGrid } from "../../features/champions/components/ChampionGrid";
import { useChampionBrowser } from "../../features/champions/hooks/useChampionBrowser";
import { LoadingState } from "../../shared/components/ui/LoadingState";
import { ChampionsPageHeader } from "./_components/ChampionsPageHeader";

export function ChampionsPage() {
  const browser = useChampionBrowser();

  return (
    <div className="page-container">
      <ChampionsPageHeader
        visibleCount={browser.filteredChampions.length}
        totalCount={browser.champions.length}
      />

      <ChampionFilterPanel
        allRegions={browser.allRegions}
        allRoles={browser.allRoles}
        house={browser.house}
        region={browser.region}
        resetFilters={browser.resetFilters}
        role={browser.role}
        search={browser.search}
        setHouse={browser.setHouse}
        setRegion={browser.setRegion}
        setRole={browser.setRole}
        setSearch={browser.setSearch}
      />

      {browser.isLoading && <LoadingState />}

      {browser.error && !browser.isLoading && (
        <div className="empty-state">
          <h2>Data portal closed</h2>
          <p>{browser.error}</p>
        </div>
      )}

      {!browser.isLoading &&
        !browser.error &&
        browser.filteredChampions.length === 0 && (
          <div className="empty-state">
            <h2>No legends match your search.</h2>
            <p>Try another name, role, house, or region.</p>
          </div>
        )}

      {!browser.isLoading &&
        !browser.error &&
        browser.filteredChampions.length > 0 && (
          <ChampionGrid champions={browser.filteredChampions} />
        )}
    </div>
  );
}
