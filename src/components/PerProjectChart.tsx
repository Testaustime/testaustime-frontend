import { Text } from "@mantine/core";
import { groupBy, sumBy } from "../utils/arrayUtils";
import { calculateTickValues } from "../utils/chartUtils";
import { prettifyProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import { colors, isColor } from "../utils/colors";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { prettyDuration, TimeUnit } from "../utils/dateUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface PerProjectChartProps {
  entries: {
    language: string | null;
    duration: number;
    id: number;
    project_name: string | null;
    editor_name: string | null;
    hostname: string | null;
    start_time: Date;
    dayStart: Date;
  }[];
  projectCount?: number;
  className: string;
  maxTimeUnit: TimeUnit;
}

const defaultColors = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
];

const chosenRandomColors: Record<string, string> = {};

function getLanguageColor(str: string): string {
  let language = str.toLowerCase();

  // If the name has multiple parts, try to resolve each one to a color and prioritize first matches
  if (language.split(" ").length > 1) {
    language = language
      .split(" ")
      .filter((possibleName) => isColor(possibleName))[0];
  }

  if (isColor(language)) {
    return colors[language];
  }

  if (language in chosenRandomColors) return chosenRandomColors[language];

  const randomColor =
    defaultColors[Math.floor(defaultColors.length * Math.random())];
  chosenRandomColors[language] = randomColor;
  return randomColor;
}

export const PerProjectChart = ({
  entries,
  projectCount = 5,
  className,
  maxTimeUnit,
}: PerProjectChartProps) => {
  if (entries.length === 0) return <Text>No data</Text>;

  let languageNames = entries
    .sort((entry1, entry2) => entry2.duration - entry1.duration)
    .map((entry) => entry.language || "other")
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 9);
  languageNames.push("other");
  languageNames = languageNames.reverse();

  // Get the total time spent on each project
  const projectGroups = groupBy(entries, (e) => e.project_name ?? "Unknown");
  const totalTimeByProject = Object.keys(projectGroups).map((projectName) => {
    const projectEntries = projectGroups[projectName];
    const langGroups = groupBy(projectEntries, (e) => e.language);
    const totalTimeByLanguage = Object.keys(langGroups).map((lang) => {
      const langEntries = langGroups[lang];
      return {
        language: lang,
        duration: sumBy(langEntries, (e) => e.duration),
      };
    });
    return {
      projectName,
      totalTimeByLanguage,
      latestUpdate: Math.max(
        ...projectEntries.map((e) => e.start_time.getTime()),
      ),
    };
  });

  /*
  Flatten totalTimeByLanguage in totalTimeByProject, to the following form:
  {
    projectName: string,
    language1_duration: number,
    language2_duration: number,
    language3_duration: number,
    ...
  }
  */

  const data: Record<string, string | number>[] = totalTimeByProject
    .sort(
      (a, b) =>
        sumBy(b.totalTimeByLanguage, (e) => e.duration) -
        sumBy(a.totalTimeByLanguage, (e) => e.duration),
    )
    .slice(0, projectCount)
    .map((project) => ({
      projectName: project.projectName,
      ...project.totalTimeByLanguage.reduce<Record<string, number>>(
        (acc, { language, duration }) => {
          const k = languageNames.includes(language) ? language : "other";
          return {
            ...acc,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            [k + "_duration"]: (acc[k + "_duration"] ?? 0) + duration,
          };
        },
        {},
      ),
    }))
    .reverse();

  const maxDuration = Math.max(
    ...totalTimeByProject.map((p) =>
      sumBy(p.totalTimeByLanguage, (l) => l.duration),
    ),
  );
  const ticks = calculateTickValues(maxDuration);

  return (
    <div className={className}>
      <Bar
        datasetIdKey="id"
        data={{
          labels: data.map((d) => d.projectName),
          datasets: languageNames.map((language) => ({
            id: language,
            label: prettifyProgrammingLanguageName(language) ?? undefined,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            data: data.map((d) => d[language + "_duration"] ?? 0),
            backgroundColor: getLanguageColor(language),
            borderColor: getLanguageColor(language),
            borderWidth: 1,
          })),
        }}
        options={{
          plugins: {
            tooltip: {
              mode: "y",
              intersect: true,
              filter: (item) => item.raw !== 0,
              callbacks: {
                label: (item) =>
                  `${item.dataset.label || "Unknown"}: ${prettyDuration(
                    Number(item.raw),
                    maxTimeUnit,
                  )}`,
              },
            },
            legend: {
              onClick: (e) => e.native?.stopPropagation(),
            },
          },
          indexAxis: "y",
          responsive: true,
          scales: {
            x: {
              stacked: true,
              ticks: {
                count: ticks.length,
                callback: (_, index) =>
                  prettyDuration(ticks[index], maxTimeUnit),
              },
            },
            y: {
              stacked: true,
            },
          },
          interaction: {
            intersect: true,
            mode: "dataset",
          },
          hover: {
            intersect: true,
            mode: "dataset",
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};
