import { List } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import { isStringNull } from "../../utils/stringUtils";
import _ from "lodash";
import { prettifyProgrammingLanguageName } from "../../utils/programmingLanguagesUtils";
import { prettyDuration } from "../../utils/dateUtils";

export interface TopLanguagesProps {
  entries: ActivityDataEntry[]
}

const getAllTimeTopLanguages = (entries: ActivityDataEntry[]): { language?: string, totalSeconds: number }[] => {
  const byLanguage = _.groupBy(entries, entry => entry.language);
  return Object.keys(byLanguage).map(language => ({
    language: isStringNull(language) ? undefined : language,
    totalSeconds: byLanguage[language].reduce((prev, curr) => prev + curr.duration, 0)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

export const TopLanguages = ({ entries }: TopLanguagesProps) => {
  return <List type="ordered" withPadding>
    {getAllTimeTopLanguages(entries).map(l => <List.Item key={l.language || "null"}>
      {prettifyProgrammingLanguageName(l.language) || <i>Unknown</i>}: {prettyDuration(l.totalSeconds)}
    </List.Item>)}
  </List>;
};