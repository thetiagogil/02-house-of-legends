import { cleanDataDragonText } from "../lib/champion-text";
import type { ChampionPassive, ChampionSpell } from "../types";

type ChampionAbilitiesProps = {
  passive: ChampionPassive;
  spells: ChampionSpell[];
};

const SPELL_LABELS = ["Q", "W", "E", "R"];

export function ChampionAbilities({ passive, spells }: ChampionAbilitiesProps) {
  const abilities = [
    {
      id: "passive",
      label: "Passive",
      name: passive.name,
      description: cleanDataDragonText(passive.description),
    },
    ...spells.map((spell, index) => ({
      id: spell.id,
      label: SPELL_LABELS[index] ?? "Spell",
      name: spell.name,
      description: cleanDataDragonText(spell.description),
    })),
  ];

  return (
    <section className="champion-abilities" aria-labelledby="abilities-title">
      <h2 id="abilities-title" className="detail-label">
        Abilities
      </h2>
      <div className="champion-ability-list">
        {abilities.map((ability) => (
          <article key={ability.id} className="champion-ability-card">
            <span>{ability.label}</span>
            <h3>{ability.name}</h3>
            <p>{ability.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
