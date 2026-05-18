import { FilterButton } from "../../../shared/components/ui/FilterButton";
import { SearchBar } from "../../../shared/components/ui/SearchBar";
import { HOUSES, houseStyles } from "../data/houses";
import { getRegionLabel } from "../data/regions";
import type { House, Region } from "../types";
import { HouseIcon } from "./HouseIcon";

type ChampionFilterPanelProps = {
  allRegions: Region[];
  allRoles: string[];
  house: House | null;
  region: Region | null;
  resetFilters: () => void;
  role: string | null;
  search: string;
  setHouse: (house: House | null) => void;
  setRegion: (region: Region | null) => void;
  setRole: (role: string | null) => void;
  setSearch: (search: string) => void;
};

export function ChampionFilterPanel({
  allRegions,
  allRoles,
  house,
  region,
  resetFilters,
  role,
  search,
  setHouse,
  setRegion,
  setRole,
  setSearch,
}: ChampionFilterPanelProps) {
  return (
    <section className="filters-panel" aria-label="Champion filters">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search for a champion..."
      />

      <div className="filter-row">
        <FilterButton
          active={!role && !house && !region}
          onClick={resetFilters}
        >
          All
        </FilterButton>
        {allRoles.map((currentRole) => (
          <FilterButton
            key={currentRole}
            active={role === currentRole}
            onClick={() => setRole(role === currentRole ? null : currentRole)}
          >
            {currentRole}
          </FilterButton>
        ))}
      </div>

      <details className="region-filter">
        <summary>
          Filter by region
          {region && <span> - {getRegionLabel(region)}</span>}
        </summary>
        <div className="filter-row region-filter__list">
          {allRegions.map((currentRegion) => (
            <FilterButton
              key={currentRegion}
              active={region === currentRegion}
              onClick={() =>
                setRegion(region === currentRegion ? null : currentRegion)
              }
            >
              {getRegionLabel(currentRegion)}
            </FilterButton>
          ))}
        </div>
      </details>

      <div className="house-grid">
        {HOUSES.map((currentHouse) => {
          const isActive = house === currentHouse;
          const houseStyle = houseStyles[currentHouse];

          return (
            <button
              key={currentHouse}
              type="button"
              onClick={() => setHouse(isActive ? null : currentHouse)}
              className={
                isActive
                  ? `house-card house-card--active ${houseStyle.className}`
                  : `house-card ${houseStyle.className}`
              }
            >
              <HouseIcon house={currentHouse} className="house-card__sigil" />
              <span className="house-card__name">{currentHouse}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
