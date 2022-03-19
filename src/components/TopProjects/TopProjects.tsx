import { List } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import _ from "lodash";
import { isStringNull } from "../../utils/stringUtils";
import { prettyDuration } from "../../utils/dateUtils";

export interface TopProjectsProps {
  entries: ActivityDataEntry[]
}

const getAllTimeTopProjects = (entries: ActivityDataEntry[]): { project_name?: string, totalSeconds: number }[] => {
  const byProject = _.groupBy(entries, entry => entry.project_name);
  return Object.keys(byProject).map(project => ({
    project_name: isStringNull(project) ? undefined : project,
    totalSeconds: byProject[project].reduce((prev, curr) => prev + curr.duration, 0)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

export const TopProjects = ({ entries }: TopProjectsProps) => {
  return <List type="ordered" withPadding>
    {getAllTimeTopProjects(entries).map(p => <List.Item key={p.project_name || "null"}>
      {p.project_name || <i>Unknown</i>}: {prettyDuration(p.totalSeconds)}
    </List.Item>)}
  </List>;
};