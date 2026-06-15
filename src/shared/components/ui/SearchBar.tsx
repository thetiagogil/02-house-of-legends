import { useId } from "react";
import { Icon } from "./Icon";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  onClear?: () => void;
};

export function SearchBar({
  value,
  onChange,
  placeholder,
  label,
  onClear,
}: SearchBarProps) {
  const canClear = Boolean(value && onClear);
  const inputId = useId();

  return (
    <div
      className={canClear ? "search-bar search-bar--clearable" : "search-bar"}
    >
      <label htmlFor={inputId} className="screen-reader-only">
        {label}
      </label>
      <Icon name="search" size={18} className="search-bar__icon" />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="search-bar__input"
      />
      {canClear && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={onClear}
          aria-label={`Clear ${label.toLowerCase()}`}
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
