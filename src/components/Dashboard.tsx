import { useActivityData } from "../hooks/useActivityData";
import { Group, MultiSelect, SegmentedControl, Text, Title, createStyles, Stack } from "@mantine/core";
import TopLanguages from "./TopLanguages";
import { prettyDuration } from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import { sumBy } from "../utils/arrayUtils";
import { DailyCodingTimeChart } from "./DailyCodingTimeChart";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PerProjectChart } from "./PerProjectChart";
import { addDays, startOfDay } from "date-fns/esm";
import useAuthentication from "../hooks/UseAuthentication";

const useStyles = createStyles(theme => ({
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
    // minHeight: "400px",
    width: "100%",
    paddingBottom: "15px"
  },
  multiSelect: {
    minWidth: "400px",
    "@media (max-width: 480px)": {
      width: "100%",
      minWidth: "unset"
    }
  },
  segmentControl: {
    marginTop: 25,
    marginBottom: -3,
    "@media (max-width: 480px)": {
      width: "100%"
    }
  }
}));

type DayRange = "month" | "week" | "all";

const getDayCount = (dayRange: DayRange, allCount: number) => {
  switch (dayRange) {
    case "month":
      return 30;
    case "week":
      return 7;
    case "all":
      return allCount;
  }
};

export const Dashboard = () => {
  const [statisticsRange, setStatisticsRange] = useState<DayRange>("week");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { username } = useAuthentication();
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
  const { classes } = useStyles();
  const entries = useActivityData();

  const firstCodingDay = entries[0]?.start_time ?? new Date(2022, 2, 14);

  const diff = new Date().getTime() - firstCodingDay.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  const dayCount = getDayCount(statisticsRange, diffDays);

  const projectNames = entries.reduce<string[]>((acc, entry) => {
    const name = entry.project_name || "Unknown";
    return acc.includes(name) ? acc : [...acc, name];
  }, []);

  const shouldFilter = selectedProjects.length > 0;

  const filteredEntries = shouldFilter
    ? entries.filter(entry =>
      selectedProjects.includes(entry.project_name || "Unknown")
    )
    : entries;

  const startOfStatisticsRange = startOfDay(addDays(new Date(), -dayCount + 1));

  const entriesInRange = filteredEntries.filter(entry =>
    entry.start_time.getTime() >= startOfStatisticsRange.getTime() &&
    entry.start_time.getTime() <= new Date().getTime()
  );

  return (
    <div style={{ width: "100%" }}>
      <Group style={{ marginBottom: "1rem" }}>
        <Text>
          Welcome, <b>{username}</b>
        </Text>
      </Group>
      <Title mb={5}>Your statistics</Title>
      <Group align="end" position="apart" mt={10} mb={30}>
        {projectNames.length !== 0 ? (
          <>
            <MultiSelect
              label="Projects"
              data={projectNames}
              value={selectedProjects}
              className={classes.multiSelect}
              onChange={selectedProjectNames => setSelectedProjects(selectedProjectNames)}
              clearable
              placeholder="Select a project filter"
            />
            <SegmentedControl
              data={[
                { label: "Last week", value: "week" },
                { label: "Last month", value: "month" },
                { label: "All time", value: "all" }
              ]}
              value={statisticsRange}
              onChange={(value: DayRange) => setStatisticsRange(value)}
              className={classes.segmentControl}
            />
          </>
        ) : (
          <MultiSelect
            label="Projects"
            data={projectNames}
            placeholder="No projects"
            disabled
          />
        )}
      </Group>
      {entriesInRange.length !== 0 ?
        <>
          <Group className={classes.dataCard}>
            <Title mt={10} order={2}>Time per day</Title>
            <DailyCodingTimeChart
              entries={entriesInRange}
              dayCount={dayCount}
              className={classes.dailyCodingTimeChart}
            />
            <Text mt={15} mb={15}>
              Total time coded in the last {dayCount} days: <b>
                {prettyDuration(sumBy(entriesInRange, entry => entry.duration))}
              </b>
            </Text>
          </Group>
          <Group className={classes.dataCard}>
            <Title mt={10} order={2}>Time per project</Title>
            <PerProjectChart entries={entriesInRange} className={classes.projectCodingChart} />
          </Group>
          {isSmallScreen ? (
            <Stack align="center">
              <div>
                <Title order={2}>Languages</Title>
                <TopLanguages entries={entriesInRange} />
              </div>
              <div>
                <Title order={2}>Projects</Title>
                <TopProjects entries={entriesInRange} />
              </div>
            </Stack>) : (
            <Group grow align="flex-start">
              <div>
                <Title order={2}>Languages</Title>
                <TopLanguages entries={entriesInRange} />
              </div>
              <div>
                <Title order={2}>Projects</Title>
                <TopProjects entries={entriesInRange} />
              </div>
            </Group>
          )}
        </>
        :
        <Text>No programming activity data to display.{" "}
          <a href="/extensions">Install one of the extensions</a>
          to begin tracking your programming.</Text>
      }
    </div>
  );
};
