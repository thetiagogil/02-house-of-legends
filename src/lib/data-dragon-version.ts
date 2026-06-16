import { fetchJson } from "./fetch-json";

const VERSION_KEY = "house-of-legends-ddragon-version";

let cachedVersion: string | null = null;
let versionPromise: Promise<string> | null = null;

const readStoredVersion = (): string | null => {
  try {
    return sessionStorage.getItem(VERSION_KEY);
  } catch {
    return null;
  }
};

const writeStoredVersion = (version: string): void => {
  try {
    sessionStorage.setItem(VERSION_KEY, version);
  } catch {
    // Session storage is an optimization; app data can still load without it.
  }
};

export const getDataDragonVersion = async (): Promise<string> => {
  if (cachedVersion) {
    return cachedVersion;
  }

  const storedVersion = readStoredVersion();

  if (storedVersion) {
    cachedVersion = storedVersion;
    return storedVersion;
  }

  if (!versionPromise) {
    versionPromise = fetchJson<string[]>(
      "https://ddragon.leagueoflegends.com/api/versions.json",
    )
      .then((versions) => {
        const latestVersion = versions[0];

        if (!latestVersion) {
          throw new Error("No League data versions are available.");
        }

        cachedVersion = latestVersion;
        writeStoredVersion(latestVersion);
        return latestVersion;
      })
      .finally(() => {
        versionPromise = null;
      });
  }

  return versionPromise;
};
