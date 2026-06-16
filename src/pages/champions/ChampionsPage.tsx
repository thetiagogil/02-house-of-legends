import { ChampionFilterPanel } from "../../features/champions/components/ChampionFilterPanel";
import { ChampionGrid } from "../../features/champions/components/ChampionGrid";
import { useChampionBrowser } from "../../features/champions/hooks/useChampionBrowser";
import { EmptyState } from "../../shared/components/ui/EmptyState";
import { LoadingState } from "../../shared/components/ui/LoadingState";
import { ChampionsPageHeader } from "./_components/ChampionsPageHeader";

export const ChampionsPage = () => {
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
        <EmptyState title="Data portal closed" message={browser.error} />
      )}

      {!browser.isLoading &&
        !browser.error &&
        browser.filteredChampions.length === 0 && (
          <EmptyState
            title="No legends match your search."
            message="Try another name, role, house, or region."
          />
        )}

      {!browser.isLoading &&
        !browser.error &&
        browser.filteredChampions.length > 0 && (
          <ChampionGrid champions={browser.filteredChampions} />
        )}
    </div>
  );
};
