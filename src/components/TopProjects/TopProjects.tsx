import { List } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import { prettyDuration } from "../../utils/dateUtils";
import getAllTimeTopProjects from "../../lib/topProjectsStatistics";

export interface TopProjectsProps {
  entries: ActivityDataEntry[]
}

export const TopProjects = ({ entries }: TopProjectsProps) => {
  return <List type="ordered" withPadding>
    {getAllTimeTopProjects(entries).map(p => <List.Item key={p.project_name || "null"}>
      {p.project_name || <i>Unknown</i>}: {prettyDuration(p.duration)}
    </List.Item>)}
  </List>;
};