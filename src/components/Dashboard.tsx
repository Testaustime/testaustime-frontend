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
} from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import { sumBy } from "../utils/arrayUtils";
import DailyCodingTimeChart, {
  transformData as transformDailyData,
} from "./DailyCodingTimeChart";
import { useState } from "react";
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

interface DashboardProps {
  username: string;
  isFrontPage: boolean;
  allEntries: ActivityDataEntry[];
  defaultDayRange?: DayRange | undefined | null;
  smoothCharts?: boolean | undefined | null;
  locale: string;
  initialActivity?: CurrentActivity | undefined | null;
}

export const Dashboard = ({
  username,
  isFrontPage,
  allEntries,
  defaultDayRange,
  smoothCharts,
  locale,
  initialActivity,
}: DashboardProps) => {
  const { t } = useTranslation();

  const [statisticsRange, setStatisticsRange] = useState<DayRange>(
    defaultDayRange || "week",
  );
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

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
    onDropdownOpen: () => {
      combobox.updateSelectedOptionIndex("active");
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
                <Combobox.EventsTarget>
                  <PillsInput.Field
                    type="hidden"
                    onBlur={() => {
                      combobox.closeDropdown();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace") {
                        event.preventDefault();
                        setSelectedProjects((projects) =>
                          projects.slice(0, projects.length - 1),
                        );
                      }
                    }}
                  />
                </Combobox.EventsTarget>
              </Pill.Group>
            </PillsInput>
          </Combobox.DropdownTarget>
          <Combobox.Dropdown>
            <Combobox.Options>
              {unfilteredProjectNames.map((projectName) => (
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
              {dayCount > 180
                ? t("dashboard.timePerMonth")
                : t("dashboard.timePerDay")}
            </Title>
            {entries.length > 0 ? (
              dayCount > 180 ? (
                <MonthlyCodingTimeChart
                  data={transformMonthlyData(entries)}
                  smoothCharts={smoothCharts ?? true}
                />
              ) : (
                <DailyCodingTimeChart
                  data={transformDailyData(entries, dayCount)}
                  smoothCharts={smoothCharts ?? true}
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
            />
          </DataCard>
          {isSmallScreen ? (
            <Stack align="center">
              <div>
                <Title order={2}>{t("dashboard.languages")}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{t("dashboard.projects")}</Title>
                <TopProjects entries={entries} allowEditing={isFrontPage} />
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
                <TopProjects entries={entries} allowEditing={isFrontPage} />
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
