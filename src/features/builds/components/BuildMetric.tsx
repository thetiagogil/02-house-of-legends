type BuildMetricProps = {
  label: string;
  value: string;
};

export function BuildMetric({ label, value }: BuildMetricProps) {
  return (
    <div className="forge-stat">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
