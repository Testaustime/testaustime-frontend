import { List } from "@mantine/core";
import { prettifyProgrammingLanguageName } from "../../utils/programmingLanguagesUtils";
import { prettyDuration } from "../../utils/dateUtils";
import { getAllTimeTopLanguages } from "../../lib/topLanguagesStatistics/topLanguagesStatistics";
import { ActivityDataEntry } from "../../types";

interface TopLanguagesProps {
  entries: ActivityDataEntry[];
}

export const TopLanguages = ({ entries }: TopLanguagesProps) => {
  return (
    <List type="ordered" withPadding>
      {getAllTimeTopLanguages(entries).map((l) => (
        <List.Item key={l.language || "null"}>
          <span>
            {prettifyProgrammingLanguageName(l.language) || <i>Unknown</i>}:{" "}
            {prettyDuration(l.duration)}
          </span>
        </List.Item>
      ))}
    </List>
  );
};
