import { useActivityData } from "../hooks/useActivityData";
import { Group, MultiSelect, SegmentedControl, Text, Title, createStyles, Stack } from "@mantine/core";
import TopLanguages from "./TopLanguages";
import { DayRange, getDayCount, prettyDuration } from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import { sumBy } from "../utils/arrayUtils";
import { DailyCodingTimeChart } from "./DailyCodingTimeChart";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PerProjectChart } from "./PerProjectChart";
import useAuthentication from "../hooks/UseAuthentication";
import { useI18nContext } from "../i18n/i18n-react";

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
    width: "100%",
    paddingBottom: "15px",
    minHeight: "400px"
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

export const Dashboard = () => {
  const [statisticsRange, setStatisticsRange] = useState<DayRange>("week");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { username } = useAuthentication();
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
  const { classes } = useStyles();
  const entries = useActivityData({
    projectFilter: selectedProjects.length === 0 ? undefined : selectedProjects,
    dayFilter: statisticsRange
  });

  const { LL } = useI18nContext();

  const firstCodingDay = [...entries]
    .sort((a, b) => a.dayStart.getTime() - b.dayStart.getTime())[0]?.start_time ?? new Date(2022, 2, 14);

  const diff = new Date().getTime() - firstCodingDay.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  const dayCount = statisticsRange === "all" ? diffDays : getDayCount(statisticsRange);

  const projectNames = entries.reduce<string[]>((acc, entry) => {
    const name = entry.project_name || "Unknown";
    return acc.includes(name) ? acc : [...acc, name];
  }, []);

  if (!username) {
    return <div>{LL.dashboard.notLoggedIn()}</div>;
  }

  const [prefix, infix, suffix] = LL.dashboard.noData.installPrompt().split("<link>");

  return (
    <div style={{ width: "100%" }}>
      <Group style={{ marginBottom: "1rem" }}>
        <Text>{LL.dashboard.greeting({ username })}</Text>
      </Group>
      <Title mb={5}>{LL.dashboard.statistics()}</Title>
      <Group align="end" position="apart" mt={10} mb={30}>
        {projectNames.length !== 0 ? (
          <>
            <MultiSelect
              label={LL.dashboard.projects()}
              data={projectNames}
              value={selectedProjects}
              className={classes.multiSelect}
              onChange={selectedProjectNames => setSelectedProjects(selectedProjectNames)}
              clearable
              placeholder={LL.dashboard.projectsFilter()}
            />
            <SegmentedControl
              data={[
                { label: LL.dashboard.timeFilters.week(), value: "week" },
                { label: LL.dashboard.timeFilters.month(), value: "month" },
                { label: LL.dashboard.timeFilters.all(), value: "all" }
              ]}
              value={statisticsRange}
              onChange={(value: DayRange) => setStatisticsRange(value)}
              className={classes.segmentControl}
            />
          </>
        ) : (
          <MultiSelect
            label={LL.dashboard.projects()}
            data={projectNames}
            placeholder={LL.dashboard.noProjects()}
            disabled
          />
        )}
      </Group>
      {entries.length !== 0 ?
        <>
          <Group className={classes.dataCard}>
            <Title mt={10} order={2}>{LL.dashboard.timePerProject()}</Title>
            <DailyCodingTimeChart
              entries={entries}
              dayCount={dayCount}
              className={classes.dailyCodingTimeChart}
            />
            <Text mt={15} mb={15}>
              {LL.dashboard.totalTime({
                days: dayCount,
                totalTime: prettyDuration(sumBy(entries, entry => entry.duration))
              })}
            </Text>
          </Group>
          <Group className={classes.dataCard}>
            <Title mt={10} order={2}>{LL.dashboard.timePerProject()}</Title>
            <PerProjectChart entries={entries} className={classes.projectCodingChart} />
          </Group>
          {isSmallScreen ? (
            <Stack align="center">
              <div>
                <Title order={2}>{LL.dashboard.languages()}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{LL.dashboard.projects()}</Title>
                <TopProjects entries={entries} />
              </div>
            </Stack>) : (
            <Group grow align="flex-start">
              <div>
                <Title order={2}>{LL.dashboard.languages()}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{LL.dashboard.projects()}</Title>
                <TopProjects entries={entries} />
              </div>
            </Group>
          )}
        </>
        :
        <Text>{LL.dashboard.noData.title()}{" "}
          {prefix}<a href="/extensions">{infix}</a>{suffix}</Text>
      }
    </div>
  );
};
