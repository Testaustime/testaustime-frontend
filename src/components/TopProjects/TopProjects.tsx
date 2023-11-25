import { List } from "@mantine/core";
import getAllTimeTopProjects from "../../lib/topProjectsStatistics";
import { ProjectEntry } from "./ProjectEntry";
import { ActivityDataEntry } from "../../types";

interface TopProjectsProps {
  entries: ActivityDataEntry[];
  username: string;
  allowEditing?: boolean;
}

export const TopProjects = ({
  entries,
  allowEditing,
  username,
}: TopProjectsProps) => {
  return (
    <List type="ordered" withPadding>
      {getAllTimeTopProjects(entries).map((p) => (
        <ProjectEntry
          key={p.project_name ?? "null"}
          name={p.project_name}
          durationSeconds={p.duration}
          allowEditing={allowEditing}
          username={username}
        />
      ))}
    </List>
  );
};
