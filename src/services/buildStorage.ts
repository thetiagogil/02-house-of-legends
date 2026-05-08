import type { Build, BuildItem } from "../types/league";

const STORAGE_KEY = "house-of-legends-builds-v1";

export type CreateBuildInput = {
  title: string;
  champion: Build["champion"];
  items: BuildItem[];
};

function isBuildItem(value: unknown): value is BuildItem {
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

function isBuild(value: unknown): value is Build {
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

function createId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readBuilds(): Build[] {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isBuild);
  } catch {
    return [];
  }
}

function writeBuilds(builds: Build[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  window.dispatchEvent(new Event("house-of-legends-builds-changed"));
}

export function createBuild(input: CreateBuildInput): Build {
  const build: Build = {
    ...input,
    id: createId(),
    win: 0,
    loss: 0,
    createdAt: Date.now(),
  };

  writeBuilds([build, ...readBuilds()]);
  return build;
}

export function updateBuild(
  buildId: string,
  patch: Partial<Pick<Build, "win" | "loss" | "title">>,
): void {
  const updatedBuilds = readBuilds().map((build) =>
    build.id === buildId ? { ...build, ...patch } : build,
  );

  writeBuilds(updatedBuilds);
}

export function deleteBuild(buildId: string): void {
  writeBuilds(readBuilds().filter((build) => build.id !== buildId));
}

export function calculateWinRate(build: Build): number {
  const games = build.win + build.loss;

  if (games === 0) {
    return 0;
  }

  if (build.loss === 0 && build.win > 0) {
    return 100;
  }

  return Math.round((build.win / games) * 100);
}

export function getWinRateClass(rate: number, games: number): string {
  if (games === 0) {
    return "win-rate win-rate--empty";
  }

  if (rate >= 75) {
    return "win-rate win-rate--high";
  }

  if (rate >= 50) {
    return "win-rate win-rate--good";
  }

  return "win-rate win-rate--low";
}
