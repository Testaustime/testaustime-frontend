import { List } from "@mantine/core";
import getAllTimeTopProjects from "../../lib/topProjectsStatistics";
import { ProjectEntry } from "./ProjectEntry";
import { ActivityDataEntry } from "../../types";
import { TimeUnit } from "../../utils/dateUtils";

interface TopProjectsProps {
  entries: ActivityDataEntry[];
  allowEditing?: boolean;
  maxTimeUnit: TimeUnit;
}

export const TopProjects = ({
  entries,
  allowEditing,
  maxTimeUnit,
}: TopProjectsProps) => {
  return (
    <List type="ordered" withPadding>
      {getAllTimeTopProjects(entries).map((p) => (
        <ProjectEntry
          key={p.project_name ?? "null"}
          name={p.project_name}
          durationSeconds={p.duration}
          allowEditing={allowEditing}
          maxTimeUnit={maxTimeUnit}
        />
      ))}
    </List>
  );
};
