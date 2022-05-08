import { List, Paper, Text, useMantineTheme } from "@mantine/core";
import { ResponsiveBar } from "@nivo/bar";
import { groupBy, sumBy } from "../utils/arrayUtils";
import { calculateTickValues } from "../utils/chartUtils";
import { prettyDuration } from "../utils/dateUtils";
import { prettifyProgrammingLanguageName } from "../utils/programmingLanguagesUtils";

export interface PerProjectChartProps {
  entries: {
    language: string | undefined;
    duration: number;
    id: number;
    project_name?: string | undefined;
    editor_name?: string | undefined;
    hostname?: string | undefined;
    start_time: Date;
    dayStart: Date;
  }[];
  projectCount?: number;
  className: string
}

export const PerProjectChart = ({ entries, projectCount = 5, className }: PerProjectChartProps) => {
  const usesDarkMode = useMantineTheme().colorScheme === "dark";

  if (entries.length === 0) return <Text>No data</Text>;

  let languageNames = entries
    .sort((entry1, entry2) => entry2.duration - entry1.duration)
    .map((entry) => entry.language || "other")
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0,9);
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
        ...projectEntries.map((e) => e.start_time.getTime())
      ),
    };
  });

  // Flatten totalTimeByLanguage in totalTimeByProject to the following form:
  // {
  //     projectName: string,
  //     language1_duration: number,
  //     language2_duration: number,
  //     language3_duration: number, 
  //     ... 
  // }
  const data: Record<string, string | number>[] = totalTimeByProject
    .sort((a, b) => sumBy(b.totalTimeByLanguage, (e) => e.duration) - sumBy(a.totalTimeByLanguage, (e) => e.duration))
    .slice(0, projectCount)
    .map((project) => ({
      projectName: project.projectName,
      ...project.totalTimeByLanguage.reduce<Record<string, number>>((acc, {language, duration}) => {
        const k = languageNames.includes(language) ? language : "other";
        return {
          ...acc,
          [k + "_duration"]: (acc[k + "_duration"] ?? 0) + duration,
        };
      }, {})
    })).reverse();

  const maxDuration = Math.max(...totalTimeByProject.map(p => sumBy(p.totalTimeByLanguage, l => l.duration)));
  const ticks = calculateTickValues(maxDuration);

  const longestProjectName = totalTimeByProject.slice().map((project) => project.projectName).sort((a, b) => b.length - a.length)[0];

  return (
    <div className={className} style={{ height: 110 * Math.min(totalTimeByProject.length, projectCount) }}>
      <ResponsiveBar
        data={data}
        keys={[...languageNames.map((l) => `${l}_duration`)]}
        labelSkipWidth={10}
        indexBy="projectName"
        margin={{ top: 30, right: 220, bottom: 30, left: 60 + (longestProjectName.length > 8 ? (longestProjectName.length - 8) * 7 : 0) }}
        padding={0.3}
        enableGridX
        enableGridY={false}
        theme={{ textColor: usesDarkMode ? "white" : "black" }}
        axisBottom={{
          format: (d: number) => prettyDuration(d),
          tickValues: ticks,
        }}
        borderRadius={2}
        labelSkipHeight={20}
        labelTextColor="black"
        gridXValues={ticks}
        axisLeft={{
          tickPadding: 8,
        }}
        tooltipLabel={(d) => String(d.data.projectName)}
        tooltip={(point) => (
          <Paper
            sx={(theme) => ({
              backgroundColor: usesDarkMode
                ? theme.colors.dark[5]
                : theme.colors.gray[1],
            })}
            p={10}
          >
            <Text underline>{point.label}</Text>
            <List>
              {Object.keys(point.data)
                .filter((k) => k.endsWith("_duration"))
                .reverse()
                .map((l) => (
                  <List.Item key={l}>
                    {prettifyProgrammingLanguageName(l.slice(0, l.length - 9)) ?? "Unknown"}:{" "}
                    {prettyDuration(point.data[l] as number)}
                  </List.Item>
                ))}
            </List>
          </Paper>
        )}
        valueFormat={(v) => prettyDuration(v)}
        layout="horizontal"
        colors={{ scheme: "paired" }}
        // TODO: Format the values properly instead of the raw "*_duration" format 
        legendLabel={ balls => {
          const str = String(balls.id);
          return prettifyProgrammingLanguageName(str.slice(0, str.length - 9)) ?? "Unknown";
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 160,
            itemWidth: 80,
            itemHeight: 20
          }
        ]}
      />
    </div>
  );
};
