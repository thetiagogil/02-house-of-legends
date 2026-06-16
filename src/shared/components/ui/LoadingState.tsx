type LoadingStateProps = {
  label?: string;
};

export const LoadingState = ({
  label = "Summoning data...",
}: LoadingStateProps) => {
  return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" />
      <span>{label}</span>
    </div>
  );
};
