export const RouteLoadingFallback = () => {
  return (
    <main className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Loading page...</p>
    </main>
  );
};
