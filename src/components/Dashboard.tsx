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
import { DayRange, getDayCount, prettyDuration } from "../utils/dateUtils";
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
import axios from "../axios";
import { startOfDay } from "date-fns";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import { filterEntries } from "../utils/activityUtils";
import {
  ActivityDataEntry,
  ApiUsersUserActivityDataResponseItem,
} from "../types";

export interface DashboardProps {
  username: string;
  isFrontPage: boolean;
  initialEntries?: ActivityDataEntry[];
  defaultDayRange?: DayRange | undefined | null;
  smoothCharts?: boolean | undefined | null;
  locale: string;
  texts: {
    installPrompt: string;
    greeting: string;
    statisticsTitle: string;
    projectsLabel: string;
    noProjectsPlaceholder: string;
    projectsFilterPlaceholder: string;
    timeFilters: {
      week: string;
      month: string;
      all: string;
    };
    timePerDay: string;
    noDataTitle: string;
    timePerProject: string;
    languagesTitle: string;
    projectsTitle: string;
    totalTime: string;
    editProjectTitle: string;
    unknownProject: string;
  };
}

export const Dashboard = ({
  username,
  isFrontPage,
  initialEntries,
  defaultDayRange,
  smoothCharts,
  locale,
  texts,
}: DashboardProps) => {
  const [statisticsRange, setStatisticsRange] = useState<DayRange>(
    defaultDayRange || "week",
  );
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  const [allEntries, setAllEntries] = useState<ActivityDataEntry[]>(
    initialEntries ?? [],
  );

  useEffect(() => {
    if (username === "@me") return;

    axios
      .get<ApiUsersUserActivityDataResponseItem[]>(
        `/users/${username}/activity/data`,
      )
      .then((response) => {
        const mappedData: ActivityDataEntry[] = response.data.map((e) => ({
          ...e,
          start_time: new Date(e.start_time),
          dayStart: startOfDay(new Date(e.start_time)),
          language: normalizeProgrammingLanguageName(e.language),
        }));

        setAllEntries(mappedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [username]);

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

  const [prefix, infix, suffix] = texts.installPrompt.split("<link>");

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
      {isFrontPage && (
        <>
          <Group style={{ marginBottom: "1rem" }}>
            <Text>{texts.greeting.replace("{{USERNAME}}", username)}</Text>
          </Group>
          <Title mb={5}>{texts.statisticsTitle}</Title>
        </>
      )}
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
              label={texts.projectsLabel}
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
                      ? texts.noProjectsPlaceholder
                      : texts.projectsFilterPlaceholder}
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
            { label: texts.timeFilters.week, value: "week" },
            { label: texts.timeFilters.month, value: "month" },
            { label: texts.timeFilters.all, value: "all" },
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
          <Group className={styles.dataCard}>
            <Title mt={10} order={2}>
              {texts.timePerDay}
            </Title>
            {entries.length > 0 ? (
              <DailyCodingTimeChart
                data={transformDailyData(entries, dayCount)}
                smoothCharts={smoothCharts ?? true}
              />
            ) : (
              <Text>{texts.noDataTitle}</Text>
            )}
            <Text mt={15} mb={15}>
              {texts.totalTime
                // TODO: Get rid of these replacements
                .replace("{{DAYS}}", String(dayCount))
                .replace(
                  "{{TOTAL_TIME}}",
                  prettyDuration(sumBy(entries, (entry) => entry.duration)),
                )}
            </Text>
          </Group>
          <Group className={styles.dataCard}>
            <Title mt={10} order={2}>
              {texts.timePerProject}
            </Title>
            <PerProjectChart
              entries={entries}
              className={styles.projectCodingChart}
            />
          </Group>
          {isSmallScreen ? (
            <Stack align="center">
              <div>
                <Title order={2}>{texts.languagesTitle}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{texts.projectsTitle}</Title>
                <TopProjects
                  entries={entries}
                  allowEditing={isFrontPage}
                  texts={{
                    editProjectTitle: texts.editProjectTitle,
                    unknownProject: texts.unknownProject,
                  }}
                />
              </div>
            </Stack>
          ) : (
            <Group grow align="flex-start">
              <div>
                <Title order={2}>{texts.languagesTitle}</Title>
                <TopLanguages entries={entries} />
              </div>
              <div>
                <Title order={2}>{texts.projectsTitle}</Title>
                <TopProjects
                  entries={entries}
                  allowEditing={isFrontPage}
                  texts={{
                    editProjectTitle: texts.editProjectTitle,
                    unknownProject: texts.unknownProject,
                  }}
                />
              </div>
            </Group>
          )}
        </>
      ) : (
        <Text>
          {texts.noDataTitle} {prefix}
          <Link href={`/${locale}/extensions`}>{infix}</Link>
          {suffix}
        </Text>
      )}
    </div>
  );
};
