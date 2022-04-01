import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import { SegmentedControl, Text, Title } from "@mantine/core";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import TopLanguages from "./TopLanguages";
import { prettyDuration } from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import DaySessions from "./DaySessions";
import { groupBy, sumBy } from "../utils/arrayUtils";
import { DailyCodingTimeChart } from "./DailyCodingTimeChart";
import { useState } from "react";

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
  const entries = useActivityData().map(entry => ({
    ...entry,
    language: normalizeProgrammingLanguageName(entry.language),
  }));

  const [statisticsRange, setStatisticsRange] = useState<DayRange>("week");
  const dayCount = getDayCount(statisticsRange);

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
    <DailyCodingTimeChart entries={entries} dayCount={dayCount} />
    <Text mt={15}>Total time programmed: {prettyDuration(sumBy(entries, entry => entry.duration))}</Text>
    <Title order={2} mt={20} mb={5}>Languages</Title>
    <TopLanguages entries={entries} />
    <Title order={2} mt={20} mb={5}>Projects</Title>
    <TopProjects entries={entries} />
    <Title order={2} mt={20} mb={5}>Your sessions</Title>
    {getAllEntriesByDay(entries).map(d => <DaySessions key={d.date.getTime()} date={d.date} entries={d.entries} />)}
  </div>;
};
