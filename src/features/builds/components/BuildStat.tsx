type BuildStatProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function BuildStat({ label, value, className = "" }: BuildStatProps) {
  return (
    <div className="build-stat">
      <p>{label}</p>
      <strong className={className}>{value}</strong>
    </div>
  );
}
