import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import { Group, SegmentedControl, Text, Title } from "@mantine/core";
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
import { addDays, startOfDay } from "date-fns/esm";

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

  const entries = useActivityData().map(entry => ({
    ...entry,
    language: normalizeProgrammingLanguageName(entry.language),
  }));

  // Filter out entries that are not in the current statistics range
  const entriesByDay = entries.filter(entry => {
    const startOfStatisticsRange = startOfDay(addDays(new Date(), -dayCount));
    return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
  });

  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  return <div>
    <Title mb={5}>Your statistics</Title>
    <SegmentedControl
      data={[
        { label: "Last week", value: "week" },
        { label: "Last month", value: "month" },
      ]}
      value={statisticsRange}
      onChange={(value: DayRange) => setStatisticsRange(value)}
      mb={15}
    />
    <Title mb={5} order={2}>Time per day</Title>
    <DailyCodingTimeChart entries={entriesByDay} dayCount={dayCount} />
    <Title mb={5} order={2}>Time per project</Title>
    <PerProjectChart entries={entriesByDay} />
    <Text mt={15}>Total time programmed ever: {prettyDuration(sumBy(entries, entry => entry.duration))}</Text>
    <Group direction={isSmallScreen ? "column" : "row"} grow mt={20} mb={20} align="start">
      <div>
        <Title order={2}>Languages</Title>
        <TopLanguages entries={entries} />
      </div>
      <div>
        <Title order={2}>Projects</Title>
        <TopProjects entries={entries} />
      </div>
    </Group>
    <Title order={2} mt={20} mb={5}>Your sessions</Title>
    {getAllEntriesByDay(entries).map(d => <DaySessions key={d.date.getTime()} date={d.date} entries={d.entries} />)}
  </div>;
};
