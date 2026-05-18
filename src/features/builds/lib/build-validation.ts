import type { Build, BuildItem } from "../types";

export function isBuildItem(value: unknown): value is BuildItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as BuildItem;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number"
  );
}

export function isBuild(value: unknown): value is Build {
  if (!value || typeof value !== "object") {
    return false;
  }

  const build = value as Build;

  return (
    typeof build.id === "string" &&
    typeof build.title === "string" &&
    typeof build.champion?.id === "string" &&
    typeof build.champion.name === "string" &&
    typeof build.champion.key === "string" &&
    Array.isArray(build.items) &&
    build.items.length === 6 &&
    build.items.every(isBuildItem) &&
    typeof build.win === "number" &&
    typeof build.loss === "number" &&
    typeof build.createdAt === "number"
  );
}
