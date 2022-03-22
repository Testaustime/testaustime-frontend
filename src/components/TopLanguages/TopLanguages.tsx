import { List } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import { prettifyProgrammingLanguageName } from "../../utils/programmingLanguagesUtils";
import { prettyDuration } from "../../utils/dateUtils";
import { getAllTimeTopLanguages } from "../../lib/topLanguagesStatistics/topLanguagesStatistics";

export interface TopLanguagesProps {
  entries: ActivityDataEntry[]
}

export const TopLanguages = ({ entries }: TopLanguagesProps) => {
  return <List type="ordered" withPadding>
    {getAllTimeTopLanguages(entries).map(l => <List.Item key={l.language || "null"}>
      {prettifyProgrammingLanguageName(l.language) || <i>Unknown</i>}: {prettyDuration(l.duration)}
    </List.Item>)}
  </List>;
};