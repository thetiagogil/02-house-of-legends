type StatBarProps = {
  label: string;
  value: number;
};

const segments = [0, 1, 2, 3, 4];

export const StatBar = ({ label, value }: StatBarProps) => {
  const filledSegments = Math.round(value / 2);

  return (
    <div className="stat-bar">
      <span className="stat-bar__label">{label}</span>
      <div className="stat-bar__segments">
        {segments.map((segment) => (
          <span
            key={segment}
            className={
              segment < filledSegments
                ? "stat-bar__segment stat-bar__segment--active"
                : "stat-bar__segment"
            }
          />
        ))}
      </div>
    </div>
  );
};
