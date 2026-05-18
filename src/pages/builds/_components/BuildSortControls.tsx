import {
  BUILD_SORT_OPTIONS,
  type BuildSort,
} from "../../../features/builds/lib/build-browser";
import { FilterButton } from "../../../shared/components/ui/FilterButton";

type BuildSortControlsProps = {
  sort: BuildSort;
  onSortChange: (sort: BuildSort) => void;
};

export function BuildSortControls({
  sort,
  onSortChange,
}: BuildSortControlsProps) {
  return (
    <div className="filter-row build-sort-row">
      {BUILD_SORT_OPTIONS.map((option) => (
        <FilterButton
          key={option}
          active={sort === option}
          onClick={() => onSortChange(option)}
        >
          {option}
        </FilterButton>
      ))}
    </div>
  );
}
