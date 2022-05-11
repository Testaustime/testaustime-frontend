import { List, Text } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import { sumBy } from "../../utils/arrayUtils";
import { prettyDuration } from "../../utils/dateUtils";
import { prettifyProgrammingLanguageName } from "../../utils/programmingLanguagesUtils";

export interface DaySessionsProps {
  entries: ActivityDataEntry[],
}

export const DaySessions = ({ entries }: DaySessionsProps) => {
  return <div>
    <Text mb={10}>Time coded: {prettyDuration(sumBy(entries, entry => entry.duration))}</Text>
    <List withPadding>
      {entries.map(entry => {
        const languageName = prettifyProgrammingLanguageName(entry.language) || <i>Unknown</i>;
        const projectName = entry.project_name || <i>Unknown</i>;
        const time = entry.start_time.toLocaleTimeString();

        return <List.Item key={time}>
          {time}: {projectName} using {languageName}
        </List.Item>;
      })}
    </List>
  </div>;
};