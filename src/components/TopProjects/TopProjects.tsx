import { List } from "@mantine/core";
import getAllTimeTopProjects from "../../lib/topProjectsStatistics";
import { ProjectEntry } from "./ProjectEntry";
import { ActivityDataEntry } from "../../types";

export interface TopProjectsProps {
  entries: ActivityDataEntry[];
  allowEditing?: boolean;
}

export const TopProjects = ({ entries, allowEditing }: TopProjectsProps) => {
  return (
    <List type="ordered" withPadding>
      {getAllTimeTopProjects(entries).map((p) => (
        <ProjectEntry
          key={p.project_name ?? "null"}
          name={p.project_name}
          durationSeconds={p.duration}
          allowEditing={allowEditing}
        />
      ))}
    </List>
  );
};
