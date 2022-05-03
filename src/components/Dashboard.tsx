import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import { Accordion, Group, MultiSelect, SegmentedControl, Text, Title, createStyles } from "@mantine/core";
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
import useAuthentication from "../hooks/UseAuthentication";

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

  const { classes } = createStyles((theme) => ({
    dataCard: {
      padding: "10px",
      backgroundColor: theme.colorScheme === "dark" ? "#222326" : "#fff",
      border: `1px solid ${theme.colorScheme === "dark" ? "#222" : "#ccc"}`,
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "30px"
    },
    dailyCodingTimeChart: {
      height: "400px",
      width: "100%"
    },
    projectCodingChart: {
      height: "400px",
      width: "100%",
      paddingBottom: "15px"
    },
    multiSelect: {
      minWidth: "400px",
      "@media (max-width: 480px)": {
        width: "100%",
        minWidth: "unset"
      },
    },
    segmentControl: {
      marginTop: 25,
      marginBottom: -3,
      "@media (max-width: 480px)": {
        width: "100%",
      },
    }
  }))();

  const entries = useActivityData().map(entry => ({
    ...entry,
    language: normalizeProgrammingLanguageName(entry.language),
  }));

  const projectNames = entries.reduce<string[]>((acc, entry) => {
    const name = entry.project_name || "Unknown";
    return acc.includes(name) ? acc : [...acc, name];
  }, []);

  const shouldFilter = selectedProjects.length > 0;

  const filteredEntries = shouldFilter ?
    entries.filter(entry => selectedProjects.includes(entry.project_name || "Unknown")) :
    entries;

  const entriesInRange = filteredEntries.filter(entry => {
    const startOfStatisticsRange = startOfDay(addDays(new Date(), -dayCount));
    return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
  });

  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  const { username } = useAuthentication();

  return <div style={{ width: "100%" }}>
    <Group style={{ marginBottom: "1rem" }}>
      <Text>Welcome, <b>{username}</b></Text>
    </Group>
    <Title mb={5}>Your statistics</Title>
    <Group align="end" position="apart" mt={10} mb={30}>
      {projectNames.length !== 0 ? 
        <>
          <MultiSelect
            label="Projects"
            data={projectNames}
            value={selectedProjects}
            className={classes.multiSelect}
            onChange={(selectedProjectNames: string[]) => setSelectedProjects(selectedProjectNames)}
            clearable
            placeholder="Select a project filter"
          />
          <SegmentedControl
            data={[
              { label: "Last week", value: "week" },
              { label: "Last month", value: "month" },
            ]}
            value={statisticsRange}
            onChange={(value: DayRange) => setStatisticsRange(value)}
            className={classes.segmentControl}
          />
        </> : <MultiSelect
          label="Projects"
          data={projectNames}
          placeholder="No projects"
          disabled
        />}
    </Group>
    {entriesInRange.length !== 0 ? 
      <>
        <Group className={classes.dataCard}>
          <Title mt={10} mb={-35} order={2}>Time per day</Title>
          <DailyCodingTimeChart entries={entriesInRange} dayCount={dayCount} className={classes.dailyCodingTimeChart}/>
          <Text mt={15} mb={15}>Total time coded in the last {dayCount} days: <b>{prettyDuration(sumBy(entriesInRange, entry => entry.duration))}</b></Text>
        </Group>
        <Group className={classes.dataCard}>
          <Title mt={10} mb={-30} order={2}>Time per latest projects</Title>
          <PerProjectChart entries={entriesInRange} className={classes.projectCodingChart}/>
        </Group>
        <Group direction={isSmallScreen ? "column" : "row"} grow mt={20} mb={20} align="start">
          <div>
            <Title order={2}>Languages</Title>
            <TopLanguages entries={entriesInRange} />
          </div>
          <div>
            <Title order={2}>Projects</Title>
            <TopProjects entries={entriesInRange} />
          </div>
        </Group>
        <Title order={2} mt={20} mb={5}>Your sessions</Title>
        <Accordion multiple>
          {getAllEntriesByDay(entriesInRange).map(d =>
            <Accordion.Item key={d.date.getTime()} label={<Text size="lg">{format(d.date, "d.M.yyyy")}</Text>}>
              <DaySessions entries={d.entries} />
            </Accordion.Item>)}
        </Accordion>
      </>
      :
      <Text>No programming activity data to display. <a href="/extensions">Install one of the extensions</a> to begin tracking your programming.</Text>
    }
  </div>;
};
