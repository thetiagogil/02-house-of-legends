import { useEffect, useState } from "react";
import { getDataDragonVersion } from "../../lib/data-dragon-version";

export function useDataDragonVersion() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    let shouldUpdate = true;

    getDataDragonVersion()
      .then((loadedVersion) => {
        if (shouldUpdate) {
          setVersion(loadedVersion);
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setVersion("");
        }
      });

    return () => {
      shouldUpdate = false;
    };
  }, []);

  return version;
}
