import { List } from "@mantine/core";
import getAllTimeTopProjects from "../../lib/topProjectsStatistics";
import { ProjectEntry } from "./ProjectEntry";
import { ActivityDataEntry } from "../../types";

export interface TopProjectsProps {
  entries: ActivityDataEntry[];
  allowEditing?: boolean;
  texts: {
    editProjectTitle: string;
    unknownProject: string;
    editModal: {
      projectName: string;
      save: string;
    };
  };
}

export const TopProjects = ({
  entries,
  allowEditing,
  texts,
}: TopProjectsProps) => {
  return (
    <List type="ordered" withPadding>
      {getAllTimeTopProjects(entries).map((p) => (
        <ProjectEntry
          key={p.project_name ?? "null"}
          name={p.project_name}
          durationSeconds={p.duration}
          allowEditing={allowEditing}
          texts={texts}
        />
      ))}
    </List>
  );
};
