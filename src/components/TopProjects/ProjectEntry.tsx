import { List } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";

export type ProjectEntryProps = {
  name?: string | undefined | null,
  durationSeconds: number
}

export const ProjectEntry = ({ name, durationSeconds }: ProjectEntryProps) => {
  return <List.Item>
    <span>{name || <i>Unknown</i>}: {prettyDuration(durationSeconds)}</span>
  </List.Item>;
};
