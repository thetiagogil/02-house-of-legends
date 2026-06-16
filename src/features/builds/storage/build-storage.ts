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

export type UpdateBuildInput = Partial<
  Pick<Build, "champion" | "items" | "loss" | "title" | "win">
>;

const createId = (): string => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const readBuilds = (): Build[] => {
  try {
    const parsed = JSON.parse(readStorageValue(STORAGE_KEY) ?? "[]") as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isBuild);
  } catch {
    return [];
  }
};

export const readBuild = (buildId: string): Build | null => {
  return readBuilds().find((build) => build.id === buildId) ?? null;
};

const writeBuilds = (builds: Build[]): boolean => {
  const didWrite = writeStorageValue(STORAGE_KEY, JSON.stringify(builds));

  if (didWrite) {
    window.dispatchEvent(new Event(BUILD_STORAGE_EVENT));
  }

  return didWrite;
};

export const createBuild = (input: CreateBuildInput): Build | null => {
  const build: Build = {
    ...input,
    id: createId(),
    win: 0,
    loss: 0,
    createdAt: Date.now(),
  };

  return writeBuilds([build, ...readBuilds()]) ? build : null;
};

export const updateBuild = (
  buildId: string,
  patch: UpdateBuildInput,
): boolean => {
  const updatedBuilds = readBuilds().map((build) =>
    build.id === buildId ? { ...build, ...patch } : build,
  );

  return writeBuilds(updatedBuilds);
};

export const deleteBuild = (buildId: string): boolean => {
  return writeBuilds(readBuilds().filter((build) => build.id !== buildId));
};
