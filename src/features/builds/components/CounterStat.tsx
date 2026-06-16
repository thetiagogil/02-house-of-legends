import { Icon } from "../../../shared/components/ui/Icon";

type CounterStatProps = {
  label: string;
  value: number;
  onAdd: () => void;
  onSubtract: () => void;
};

export const CounterStat = ({
  label,
  value,
  onAdd,
  onSubtract,
}: CounterStatProps) => {
  return (
    <div className="build-stat">
      <p>{label}</p>
      <div className="counter-stat">
        <button
          type="button"
          onClick={onSubtract}
          aria-label={`Decrement ${label}`}
        >
          <Icon name="minus" size={14} />
        </button>
        <strong>{value}</strong>
        <button type="button" onClick={onAdd} aria-label={`Increment ${label}`}>
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
};
