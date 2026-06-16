type ChampionsPageHeaderProps = {
  visibleCount: number;
  totalCount: number;
};

export const ChampionsPageHeader = ({
  visibleCount,
  totalCount,
}: ChampionsPageHeaderProps) => {
  return (
    <header className="page-header">
      <h1>Champions</h1>
      <p>
        {visibleCount} of {totalCount} legends
      </p>
    </header>
  );
};
