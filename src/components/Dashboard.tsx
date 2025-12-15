"use client";

import {
  Group,
  SegmentedControl,
  Text,
  Title,
  Stack,
  Combobox,
  PillsInput,
  useCombobox,
  Pill,
  Input,
  CheckIcon,
} from "@mantine/core";
import TopLanguages from "./TopLanguages";
import {
  DayRange,
  getDayCount,
  isDayRange,
  prettyDuration,
  TimeUnit,
} from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import { sumBy } from "../utils/arrayUtils";
import DailyCodingTimeChart, {
  transformData as transformDailyData,
} from "./DailyCodingTimeChart";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PerProjectChart } from "./PerProjectChart";
import Link from "next/link";
import styles from "./Dashboard.module.css";
import { filterEntries } from "../utils/activityUtils";
import { ActivityDataEntry } from "../types";
import { useTranslation } from "react-i18next";
import { CurrentActivity } from "./CurrentActivity/CurrentActivity";
import { DataCard } from "./DataCard/DataCard";
import MonthlyCodingTimeChart, {
  transformData as transformMonthlyData,
} from "./MonthlyCodingTimeChart";
import { useSettings } from "../hooks/useSettings";

interface DashboardProps {
  username: string;
  isFrontPage: boolean;
  allEntries: ActivityDataEntry[];
  locale: string;
  initialActivity: CurrentActivity | undefined | null;
}

export const Dashboard = ({
  username,
  isFrontPage,
  allEntries,
  locale,
  initialActivity,
}: DashboardProps) => {
  const { t } = useTranslation();
  const { smoothCharts, defaultDayRange, timeInHours } = useSettings();
  const maxTimeUnit: TimeUnit = timeInHours ? "h" : "y";

  const [statisticsRange, setStatisticsRange] = useState<DayRange>(
    defaultDayRange ?? "week",
  );
  useEffect(() => {
    if (defaultDayRange) {
      setStatisticsRange(defaultDayRange);
    }
  }, [defaultDayRange]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  const { entries, unfilteredProjectNames } = filterEntries(allEntries, {
    projectFilter: selectedProjects.length === 0 ? undefined : selectedProjects,
    dayFilter: statisticsRange,
  });

  const firstCodingDay =
    [...entries].sort((a, b) => a.dayStart.getTime() - b.dayStart.getTime())[0]
      ?.start_time ?? new Date(2022, 2, 14);

  const diff = new Date().getTime() - firstCodingDay.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  const dayCount =
    statisticsRange === "all" ? diffDays : getDayCount(statisticsRange);

  const [prefix, infix, suffix] = t("dashboard.noData.installPrompt").split(
    "<link>",
  );

  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.updateSelectedOptionIndex("active");
      combobox.focusSearchInput();
    },
  });

  return (
    <div style={{ width: "100%" }}>
      <Stack gap="1rem">
        {isFrontPage ? (
          <>
            <Text>{t("dashboard.greeting", { username })}</Text>
            {initialActivity && (
              <CurrentActivity
                initialActivity={initialActivity}
                username={username}
              />
            )}
            <Title mb={5}>{t("dashboard.statistics")}</Title>
          </>
        ) : (
          <>
            <Title>{username}</Title>
            {initialActivity && (
              <CurrentActivity
                initialActivity={initialActivity}
                username={username}
              />
            )}
          </>
        )}
      </Stack>
      <Group align="end" mt={10} mb={30} justify="space-between">
        <Combobox
          store={combobox}
          onOptionSubmit={(option) => {
            if (selectedProjects.includes(option)) {
              setSelectedProjects((projects) =>
                projects.filter((project) => project !== option),
              );
            } else {
              setSelectedProjects((projects) => [...projects, option]);
            }
          }}
          withinPortal={false}
        >
          <Combobox.DropdownTarget>
            <PillsInput
              label={t("dashboard.projects")}
              disabled={unfilteredProjectNames.length === 0}
              pointer
              onClick={() => {
                combobox.toggleDropdown();
              }}
              style={{
                width: 400,
              }}
            >
              <Pill.Group>
                {selectedProjects.length > 0 ? (
                  selectedProjects.map((projectName) => (
                    <Pill
                      key={projectName}
                      withRemoveButton
                      onRemove={() => {
                        setSelectedProjects((projects) =>
                          projects.filter((project) => project !== projectName),
                        );
                      }}
                    >
                      {projectName}
                    </Pill>
                  ))
                ) : (
                  <Input.Placeholder>
                    {unfilteredProjectNames.length === 0
                      ? t("dashboard.noProjects")
                      : t("dashboard.projectsFilter")}
                  </Input.Placeholder>
                )}
              </Pill.Group>
            </PillsInput>
          </Combobox.DropdownTarget>
          <Combobox.Dropdown>
            <Combobox.Search
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
              }}
              placeholder="Search"
            />
            <Combobox.Options>
              {unfilteredProjectNames
                .filter((p) => p.toLowerCase().includes(search.toLowerCase()))
                .map((projectName) => (
                  <Combobox.Option
                    value={projectName}
                    key={projectName}
                    active={selectedProjects.includes(projectName)}
                  >
                    {selectedProjects.includes(projectName) && (
                      <CheckIcon size={12} style={{ marginInlineEnd: 6 }} />
                    )}
                    <span>{projectName}</span>
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <SegmentedControl
          data={[
            { label: t("dashboard.timeFilters.week"), value: "week" },
            { label: t("dashboard.timeFilters.month"), value: "month" },
            { label: t("dashboard.timeFilters.all"), value: "all" },
          ]}
          value={statisticsRange}
          onChange={(value: string) => {
            if (isDayRange(value)) {
              setStatisticsRange(value);
            }
          }}
          className={styles.segmentControl}
        />
      </Group>
      {entries.length !== 0 ? (
        <>
          <DataCard>
            <Title mt={10} order={2}>
              {t("dashboard.timePerDay")}
            </Title>
            {entries.length > 0 ? (
              dayCount > 180 ? (
                <MonthlyCodingTimeChart
                  data={transformMonthlyData(entries)}
                  smoothCharts={smoothCharts}
                  maxTimeUnit={maxTimeUnit}
                />
              ) : (
                <DailyCodingTimeChart
                  data={transformDailyData(entries, dayCount)}
                  smoothCharts={smoothCharts}
                  maxTimeUnit={maxTimeUnit}
                />
              )
            ) : (
              <Text>{t("dashboard.noData.title")}</Text>
            )}
            <Text mt={15} mb={15}>
              {t("dashboard.totalTime", {
                days: dayCount,
                totalTime: prettyDuration(
                  sumBy(entries, (entry) => entry.duration),
                  maxTimeUnit,
                ),
              })}
            </Text>
          </DataCard>
          <DataCard>
            <Title mt={10} order={2}>
              {t("dashboard.timePerProject")}
            </Title>
            <PerProjectChart
              entries={entries}
              className={styles.projectCodingChart}
              maxTimeUnit={maxTimeUnit}
            />
          </DataCard>
          {isSmallScreen ? (
            <Stack>
              <div>
                <Title order={2}>{t("dashboard.languages")}</Title>
                <TopLanguages entries={entries} maxTimeUnit={maxTimeUnit} />
              </div>
              <div>
                <Title order={2}>{t("dashboard.projects")}</Title>
                <TopProjects
                  entries={entries}
                  allowEditing={isFrontPage}
                  maxTimeUnit={maxTimeUnit}
                />
              </div>
            </Stack>
          ) : (
            <Group grow align="flex-start">
              <div>
                <Title order={2}>{t("dashboard.languages")}</Title>
                <TopLanguages entries={entries} maxTimeUnit={maxTimeUnit} />
              </div>
              <div>
                <Title order={2}>{t("dashboard.projects")}</Title>
                <TopProjects
                  entries={entries}
                  allowEditing={isFrontPage}
                  maxTimeUnit={maxTimeUnit}
                />
              </div>
            </Group>
          )}
        </>
      ) : (
        <Text>
          {t("dashboard.noData.title")} {prefix}
          <Link href={`/${locale}/extensions`}>{infix}</Link>
          {suffix}
        </Text>
      )}
    </div>
  );
};
