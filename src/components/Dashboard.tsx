import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import {
  Group,
  MultiSelect,
  SegmentedControl,
  Text,
  Title,
  createStyles,
  Stack,
} from "@mantine/core";
import TopLanguages from "./TopLanguages";
import { DayRange, getDayCount, prettyDuration } from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import { sumBy } from "../utils/arrayUtils";
import DailyCodingTimeChart, {
  transformData as transformDailyData,
} from "./DailyCodingTimeChart";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PerProjectChart } from "./PerProjectChart";
import { useAuthentication } from "../hooks/useAuthentication";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styles from "./Dashboard.module.css";

const useStyles = createStyles((theme) => ({
  dataCard: {
    padding: "10px",
    backgroundColor: theme.colorScheme === "dark" ? "#222326" : "#fff",
    border: `1px solid ${theme.colorScheme === "dark" ? "#222" : "#ccc"}`,
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
}));

export interface DashboardProps {
  username: string;
  isFrontPage: boolean;
  initialEntries?: ActivityDataEntry[];
  defaultDayRange?: DayRange | undefined | null;
  smoothCharts?: boolean | undefined | null;
}

export const Dashboard = ({
  username,
  isFrontPage,
  initialEntries,
  defaultDayRange,
  smoothCharts,
}: DashboardProps) => {
  const [statisticsRange, setStatisticsRange] = useState<DayRange>(
    defaultDayRange || "week",
  );
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { username: authenticatedUsername } = useAuthentication();
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
  const { classes } = useStyles();
  const entries = useActivityData(
    username,
    {
      projectFilter:
        selectedProjects.length === 0 ? undefined : selectedProjects,
      dayFilter: statisticsRange,
    },
    { initialData: initialEntries, shouldFetch: username !== "@me" },
  );

  const { t } = useTranslation();

  const firstCodingDay =
    [...entries].sort((a, b) => a.dayStart.getTime() - b.dayStart.getTime())[0]
      ?.start_time ?? new Date(2022, 2, 14);

  const diff = new Date().getTime() - firstCodingDay.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  const dayCount =
    statisticsRange === "all" ? diffDays : getDayCount(statisticsRange);

  const projectNames = entries.reduce<string[]>((acc, entry) => {
    const name = entry.project_name || "Unknown";
    return acc.includes(name) ? acc : [...acc, name];
  }, []);

  const [prefix, infix, suffix] = t("dashboard.noData.installPrompt").split(
    "<link>",
  );

  if (!authenticatedUsername) {
    return <div>{t("dashboard.notLoggedIn")}</div>;
  }

  const isOwnDashboard = username === "@me";

  return (
    <div style={{ width: "100%" }}>
      {isFrontPage && (
        <>
          <Group style={{ marginBottom: "1rem" }}>
            <Text>
              {t("dashboard.greeting", {
                username: isOwnDashboard ? authenticatedUsername : username,
              })}
            </Text>
          </Group>
          <Title mb={5}>{t("dashboard.statistics")}</Title>
        </>
      )}
      <Group align="end" position="apart" mt={10} mb={30}>
        <MultiSelect
          label={t("dashboard.projects")}
          data={projectNames}
          value={selectedProjects}
          className={styles.multiSelect}
          onChange={(selectedProjectNames) => {
            setSelectedProjects(selectedProjectNames);
          }}
          clearable
          placeholder={
            projectNames.length === 0
              ? t("dashboard.noProjects")
              : t("dashboard.projectsFilter")
          }
          disabled={projectNames.length === 0}
        />
        <SegmentedControl
          data={[
            { label: t("dashboard.timeFilters.week"), value: "week" },
            { label: t("dashboard.timeFilters.month"), value: "month" },
            { label: t("dashboard.timeFilters.all"), value: "all" },
          ]}
          value={statisticsRange}
          onChange={(value: DayRange) => {
            setStatisticsRange(value);
          }}
          className={styles.segmentControl}
        />
      </Group>
      {entries.length !== 0 ? (
        <>
          <Group className={classes.dataCard}>
            <Title mt={10} order={2}>
              {t("dashboard.timePerDay")}
            </Title>
            {entries.length > 0 ? (
              <DailyCodingTimeChart
                data={transformDailyData(entries, dayCount)}
                smoothCharts={smoothCharts ?? true}
              />
            ) : (
              <Text>{t("dashboard.noData.title")}</Text>
            )}
            <Text mt={15} mb={15}>
              {t("dashboard.totalTime", {
                days: dayCount,
                totalTime: prettyDuration(
                  sumBy(entries, (entry) => entry.duration),
                ),
              })}
            </Text>
          </Group>
          <Group className={classes.dataCard}>
            <Title mt={10} order={2}>
              {t("dashboard.timePerProject")}
            </Title>
            <PerProjectChart
              entries={entries}
              className={styles.projectCodingChart}
            />
          </Group>
          {isSmallScreen ? (
            <Stack align="center">
              <div>
                <Title order={2}>{t("dashboard.languages")}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{t("dashboard.projects")}</Title>
                <TopProjects entries={entries} allowEditing={isOwnDashboard} />
              </div>
            </Stack>
          ) : (
            <Group grow align="flex-start">
              <div>
                <Title order={2}>{t("dashboard.languages")}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{t("dashboard.projects")}</Title>
                <TopProjects entries={entries} allowEditing={isOwnDashboard} />
              </div>
            </Group>
          )}
        </>
      ) : (
        <Text>
          {t("dashboard.noData.title")} {prefix}
          <Link href="/extensions">{infix}</Link>
          {suffix}
        </Text>
      )}
    </div>
  );
};
