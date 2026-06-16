import { ItemCategoryPanel } from "../../features/items/components/ItemCategoryPanel";
import { ItemResultsPanel } from "../../features/items/components/ItemResultsPanel";
import { useItemsBrowser } from "../../features/items/hooks/useItemsBrowser";

export const ItemsPage = () => {
  const browser = useItemsBrowser();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Artifacts</h1>
        <p>{browser.visibleItems.length} visible relics</p>
      </header>

      <section className="items-browser">
        <ItemCategoryPanel
          activeCategory={browser.activeCategory}
          itemCounts={browser.itemCounts}
          totalCount={browser.items.length}
          onCategoryChange={browser.setActiveCategory}
        />

        <ItemResultsPanel
          activeHint={browser.activeHint}
          activeLabel={browser.activeLabel}
          error={browser.error}
          isLoading={browser.isLoading}
          search={browser.search}
          sort={browser.sort}
          version={browser.version}
          visibleItems={browser.visibleItems}
          onSearchChange={browser.setSearch}
          onSortChange={browser.setSort}
        />
      </section>
    </div>
  );
};
