import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import { Accordion, Group, MultiSelect, SegmentedControl, Text, Title } from "@mantine/core";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import TopLanguages from "./TopLanguages";
import { prettyDuration } from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import DaySessions from "./DaySessions";
import { groupBy, sumBy } from "../utils/arrayUtils";
import { DailyCodingTimeChart } from "./DailyCodingTimeChart";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PerProjectChart } from "./PerProjectChart";
import { addDays, format, startOfDay } from "date-fns/esm";

type DayRange = "month" | "week"

const getDayCount = (dayRange: DayRange) => {
  switch (dayRange) {
    case "month":
      return 30;
    case "week":
      return 7;
  }
};

const getAllEntriesByDay = (entries: ActivityDataEntry[]): { date: Date, entries: ActivityDataEntry[] }[] => {
  const byDayDictionary = groupBy(entries, entry => entry.dayStart.getTime());
  return Object.keys(byDayDictionary).sort((a, b) => Number(b) - Number(a)).map(key => ({
    date: new Date(Number(key)),
    entries: byDayDictionary[key].sort((a, b) => b.start_time.getTime() - a.start_time.getTime())
  }));
};

export const Dashboard = () => {
  const [statisticsRange, setStatisticsRange] = useState<DayRange>("week");
  const dayCount = getDayCount(statisticsRange);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const entries = useActivityData().map(entry => ({
    ...entry,
    language: normalizeProgrammingLanguageName(entry.language),
  }));

  const projectNames = entries.reduce<string[]>((acc, entry) => {
    const name = entry.project_name || "Unknown";
    return acc.includes(name) ? acc : [...acc, name];
  }, []);

  // Filter out entries that are not selected and are not in the current statistics range
  const filteredEntries = entries
    .filter(entry => selectedProjects.includes(entry.project_name || "Unknown"))
    .filter(entry => {
      const startOfStatisticsRange = startOfDay(addDays(new Date(), -dayCount));
      return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
    });

  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  return <div>
    <Title mb={5}>Your statistics</Title>
    <Group align="end" position="apart" mt={10} mb={30}>
      <MultiSelect
        sx={{ minWidth: 400 }}
        label="Projects"
        data={projectNames}
        onChange={(selectedProjectNames: string[]) => setSelectedProjects(selectedProjectNames)}
      />
      <SegmentedControl
        data={[
          { label: "Last week", value: "week" },
          { label: "Last month", value: "month" },
        ]}
        value={statisticsRange}
        onChange={(value: DayRange) => setStatisticsRange(value)}
      />
    </Group>
    <Title mb={5} order={2}>Time per day</Title>
    <DailyCodingTimeChart entries={filteredEntries} dayCount={dayCount} />
    <Title mb={5} order={2}>Time per last updated projects</Title>
    <PerProjectChart entries={filteredEntries} />
    <Text mt={15}>Total time programmed: {prettyDuration(sumBy(filteredEntries, entry => entry.duration))}</Text>
    <Group direction={isSmallScreen ? "column" : "row"} grow mt={20} mb={20} align="start">
      <div>
        <Title order={2}>Languages</Title>
        <TopLanguages entries={filteredEntries} />
      </div>
      <div>
        <Title order={2}>Projects</Title>
        <TopProjects entries={filteredEntries} />
      </div>
    </Group>
    <Title order={2} mt={20} mb={5}>Your sessions</Title>
    <Accordion multiple>
      {getAllEntriesByDay(filteredEntries).map(d =>
        <Accordion.Item key={d.date.getTime()} label={<Text size="lg">{format(d.date, "d.M.yyyy")}</Text>}>
          <DaySessions entries={d.entries} />
        </Accordion.Item>)}
    </Accordion>
  </div>;
};
