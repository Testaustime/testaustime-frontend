import { List, Text, Title } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import { prettyDuration } from "../../utils/dateUtils";
import { prettifyProgrammingLanguageName } from "../../utils/programmingLanguagesUtils";

export interface DaySessionsProps {
  date: Date,
  entries: ActivityDataEntry[],
}

export const DaySessions = ({ date, entries }: DaySessionsProps) => {
  return <div>
    <Title order={3} mt={15} mb={5}>{date.toLocaleDateString()}</Title>
    <Text>Time coded: {prettyDuration(entries.reduce((prev, curr) => prev + curr.duration, 0))}</Text>
    <List withPadding>
      {entries.map(entry => <List.Item key={entry.start_time.getTime()}>
        {entry.start_time.toLocaleTimeString()}: {entry.project_name || <i>Unknown</i>} using {prettifyProgrammingLanguageName(entry.language) || <i>Unknown</i>}
      </List.Item>)}
    </List>
  </div>;
};