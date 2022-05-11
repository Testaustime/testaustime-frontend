import { List, Paper, Text, useMantineTheme } from "@mantine/core";
import { ResponsiveBar } from "@nivo/bar";
import { groupBy, sumBy } from "../utils/arrayUtils";
import { calculateTickValues } from "../utils/chartUtils";
import { prettyDuration } from "../utils/dateUtils";
import { prettifyProgrammingLanguageName } from "../utils/programmingLanguagesUtils";

export interface PerProjectChartProps {
  entries: {
    language?: string,
    duration: number,
    id: number,
    project_name?: string,
    editor_name?: string,
    hostname?: string,
    start_time: Date,
    dayStart: Date
  }[],
  projectCount?: number,
  className: string
}

export const PerProjectChart = ({ entries, projectCount = 5, className }: PerProjectChartProps) => {
  const usesDarkMode = useMantineTheme().colorScheme === "dark";

  if (entries.length === 0) return <Text>No data</Text>;

  const languageNames = entries
    .map(entry => entry.language || "unknown")
    .filter((item, index, array) => array.indexOf(item) === index);

  // Get the total time spent on each project
  const projectGroups = groupBy(entries, e => e.project_name ?? "Unknown");
  const totalTimeByProject = Object.keys(projectGroups).map(projectName => {
    const projectEntries = projectGroups[projectName];
    const langGroups = groupBy(projectEntries, e => e.language);
    const totalTimeByLanguage = Object.keys(langGroups).map(lang => {
      const langEntries = langGroups[lang];
      return {
        language: lang,
        duration: sumBy(langEntries, e => e.duration)
      };
    });
    return {
      projectName,
      totalTimeByLanguage,
      latestUpdate: Math.max(
        ...projectEntries.map(e => e.start_time.getTime())
      )
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
    .sort((a, b) => b.latestUpdate - a.latestUpdate)
    .slice(0, projectCount)
    .reverse()
    .map(project => {
      return {
        projectName: project.projectName,
        ...project.totalTimeByLanguage.reduce<Record<string, number>>(
          (acc, curr) => {
            acc[curr.language + "_duration"] = curr.duration;
            return acc;
          },
          {}
        )
      };
    });

  const maxDuration = Math.max(...totalTimeByProject.map(p => sumBy(p.totalTimeByLanguage, l => l.duration)));
  const ticks = calculateTickValues(maxDuration);

  const longestProjectName = totalTimeByProject
    .slice()
    .map(project => project.projectName).sort((a, b) => b.length - a.length)[0];

  return (
    <div className={className} style={{ height: 130 * Math.min(totalTimeByProject.length, projectCount) }}>
      <ResponsiveBar
        data={data}
        keys={[...languageNames.map(l => `${l}_duration`)]}
        labelSkipWidth={10}
        indexBy="projectName"
        margin={{
          top: 0,
          right: 30,
          bottom: 30,
          left: 60 + (longestProjectName.length > 8 ? (longestProjectName.length - 8) * 7 : 0)
        }}
        padding={0.3}
        enableGridY={false}
        enableGridX
        theme={{ textColor: usesDarkMode ? "white" : "black" }}
        axisBottom={{
          format: (d: number) => prettyDuration(d),
          tickValues: ticks
        }}
        gridXValues={ticks}
        axisLeft={{ tickPadding: 20 }}
        tooltipLabel={d => String(d.data.projectName)}
        tooltip={point => (
          <Paper
            sx={theme => ({
              backgroundColor: usesDarkMode
                ? theme.colors.dark[5]
                : theme.colors.gray[1]
            })}
            p={10}
          >
            <Text underline>{point.label}</Text>
            <List>
              {Object.keys(point.data)
                .filter(k => k.endsWith("_duration"))
                .map(l => (
                  <List.Item key={l}>
                    {prettifyProgrammingLanguageName(l.slice(0, l.length - 9)) ?? "Unknown"}:{" "}
                    {prettyDuration(point.data[l] as number)}
                  </List.Item>
                ))}
            </List>
          </Paper>
        )}
        valueFormat={v => prettyDuration(v)}
        layout="horizontal"
        colors={{ scheme: "paired" }}
      />
    </div>
  );
};
