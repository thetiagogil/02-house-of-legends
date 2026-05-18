import type { BuildGroup as BuildGroupData } from "../lib/build-browser";
import { BuildGroup } from "./BuildGroup";

type BuildGroupListProps = {
  groups: BuildGroupData[];
  version: string;
  onChange: () => void;
};

export function BuildGroupList({
  groups,
  version,
  onChange,
}: BuildGroupListProps) {
  return (
    <div className="build-groups">
      {groups.map((group) => (
        <BuildGroup
          key={group.championId}
          champion={group.champion}
          builds={group.builds}
          version={version}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
