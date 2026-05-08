import type { ReactNode } from "react";

type FilterButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
};

export function FilterButton({
  active,
  onClick,
  children,
  count,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active ? "filter-button filter-button--active" : "filter-button"
      }
    >
      {children}
      {count !== undefined && (
        <span className="filter-button__count">{count}</span>
      )}
    </button>
  );
}
