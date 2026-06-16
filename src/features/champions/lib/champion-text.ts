const HTML_TAG_PATTERN = /<[^>]*>/g;
const HTML_ENTITY_PATTERN = /&(#x?[0-9a-f]+|[a-z]+);/gi;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
};

const toCodePointText = (codePoint: number, fallback: string): string => {
  return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback;
};

const decodeEntity = (entity: string): string => {
  const normalized = entity.toLowerCase();
  const fallback = `&${entity};`;

  if (normalized.startsWith("#x")) {
    return toCodePointText(Number.parseInt(normalized.slice(2), 16), fallback);
  }

  if (normalized.startsWith("#")) {
    return toCodePointText(Number.parseInt(normalized.slice(1), 10), fallback);
  }

  return NAMED_ENTITIES[normalized] ?? fallback;
};

export const cleanDataDragonText = (value: string): string => {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(HTML_TAG_PATTERN, " ")
    .replace(HTML_ENTITY_PATTERN, (_, entity: string) => decodeEntity(entity))
    .replace(/\s+/g, " ")
    .trim();
};

export const cleanDataDragonList = (values: string[]): string[] => {
  return values.map(cleanDataDragonText).filter(Boolean);
};
