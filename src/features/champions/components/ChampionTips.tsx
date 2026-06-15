import { cleanDataDragonList } from "../lib/champion-text";

type ChampionTipsProps = {
  allytips: string[];
  enemytips: string[];
};

export function ChampionTips({ allytips, enemytips }: ChampionTipsProps) {
  const allyTips = cleanDataDragonList(allytips);
  const enemyTips = cleanDataDragonList(enemytips);

  if (allyTips.length === 0 && enemyTips.length === 0) {
    return null;
  }

  return (
    <section className="champion-tips-grid" aria-label="Champion tips">
      {allyTips.length > 0 && (
        <article className="champion-tip-panel">
          <h2 className="detail-label">Ally Tips</h2>
          <ul>
            {allyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>
      )}

      {enemyTips.length > 0 && (
        <article className="champion-tip-panel">
          <h2 className="detail-label">Enemy Tips</h2>
          <ul>
            {enemyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
