import { readStorageValue, writeStorageValue } from "../../../lib/storage";
import { isBuild } from "../lib/build-validation";
import type { Build, BuildItem } from "../types";

const STORAGE_KEY = "house-of-legends-builds-v1";
export const BUILD_STORAGE_EVENT = "house-of-legends-builds-changed";

export type CreateBuildInput = {
  title: string;
  champion: Build["champion"];
  items: BuildItem[];
};

function createId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readBuilds(): Build[] {
  try {
    const parsed = JSON.parse(readStorageValue(STORAGE_KEY) ?? "[]") as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isBuild);
  } catch {
    return [];
  }
}

function writeBuilds(builds: Build[]): void {
  writeStorageValue(STORAGE_KEY, JSON.stringify(builds));
  window.dispatchEvent(new Event(BUILD_STORAGE_EVENT));
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
