import { Link } from "react-router-dom";
import { Icon } from "../../../shared/components/ui/Icon";
import { SearchBar } from "../../../shared/components/ui/SearchBar";

type BuildsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function BuildsToolbar({ search, onSearchChange }: BuildsToolbarProps) {
  return (
    <section className="build-toolbar build-toolbar--cards">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        onClear={() => onSearchChange("")}
        label="Search builds"
        placeholder="Search champion or build..."
      />
      <Link to="/builds/new" aria-label="Create build" className="round-action">
        <Icon name="plus" />
      </Link>
    </section>
  );
}
