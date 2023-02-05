import { List } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import getAllTimeTopProjects from "../../lib/topProjectsStatistics";
import { ProjectEntry } from "./ProjectEntry";

export interface TopProjectsProps {
  entries: ActivityDataEntry[]
}

export const TopProjects = ({ entries }: TopProjectsProps) => {
  return <List type="ordered" withPadding>
    {getAllTimeTopProjects(entries).map(p => <ProjectEntry
      key={p.project_name ?? "null"}
      name={p.project_name}
      durationSeconds={p.duration}
    />)}
  </List>;
};
