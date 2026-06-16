import { FilterButton } from "../../../shared/components/ui/FilterButton";
import { SearchBar } from "../../../shared/components/ui/SearchBar";
import { championImages } from "../../champions/lib/champion-images";
import type { ChampionSummary } from "../../champions/types";
import { filterChampionOptions } from "../lib/build-form-options";

type BuildChampionPickerProps = {
  champions: ChampionSummary[];
  selectedChampionId: string;
  roles: string[];
  search: string;
  role: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSelect: (champion: ChampionSummary) => void;
};

export const BuildChampionPicker = ({
  champions,
  selectedChampionId,
  roles,
  search,
  role,
  onSearchChange,
  onRoleChange,
  onSelect,
}: BuildChampionPickerProps) => {
  const filteredChampions = filterChampionOptions(champions, search, role);

  return (
    <>
      <div className="picker-panel__header">
        <div>
          <h2>Choose Champion</h2>
          <p>{filteredChampions.length} available legends</p>
        </div>
      </div>

      <SearchBar
        value={search}
        onChange={onSearchChange}
        onClear={() => onSearchChange("")}
        label="Search build champions"
        placeholder="Search champions..."
      />

      <div className="filter-row picker-filter-row">
        <FilterButton
          active={role === "All"}
          onClick={() => onRoleChange("All")}
        >
          All
        </FilterButton>
        {roles.map((currentRole) => (
          <FilterButton
            key={currentRole}
            active={role === currentRole}
            onClick={() => onRoleChange(currentRole)}
          >
            {currentRole}
          </FilterButton>
        ))}
      </div>

      <div className="champion-picker-grid">
        {filteredChampions.map((champion) => (
          <button
            key={champion.id}
            type="button"
            onClick={() => onSelect(champion)}
            aria-pressed={selectedChampionId === champion.id}
            className={
              selectedChampionId === champion.id
                ? "champion-picker-card champion-picker-card--active"
                : "champion-picker-card"
            }
          >
            <img src={championImages.tile(champion.id)} alt="" loading="lazy" />
            <span>
              <strong>{champion.name}</strong>
              <small>{champion.tags.join(" / ")}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
