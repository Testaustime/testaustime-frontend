import { List } from "@mantine/core";
import { ActivityDataEntry } from "../../hooks/useActivityData";
import { isStringNull } from "../../utils/stringUtils";
import { prettifyProgrammingLanguageName } from "../../utils/programmingLanguagesUtils";
import { prettyDuration } from "../../utils/dateUtils";
import { groupBy, sumBy } from "../../utils/arrayUtils";

export interface TopLanguagesProps {
  entries: ActivityDataEntry[]
}

const getAllTimeTopLanguages = (entries: ActivityDataEntry[]): { language?: string, totalSeconds: number }[] => {
  const byLanguage = groupBy(entries, entry => entry.language);
  return Object.keys(byLanguage).map(language => ({
    language: isStringNull(language) ? undefined : language,
    totalSeconds: sumBy(byLanguage[language], entry => entry.duration)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

export const TopLanguages = ({ entries }: TopLanguagesProps) => {
  return <List type="ordered" withPadding>
    {getAllTimeTopLanguages(entries).map(l => <List.Item key={l.language || "null"}>
      {prettifyProgrammingLanguageName(l.language) || <i>Unknown</i>}: {prettyDuration(l.totalSeconds)}
    </List.Item>)}
  </List>;
};