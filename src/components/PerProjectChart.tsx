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
}

export const PerProjectChart = ({ entries, projectCount = 5 }: PerProjectChartProps) => {
  const usesDarkMode = useMantineTheme().colorScheme === "dark";

  if (entries.length === 0) return <Text>No data</Text>;

  const languageNames = entries
    .map((entry) => entry.language || "unknown")
    .filter((item, index, array) => array.indexOf(item) === index);

  // Get the total time spent on each project
  const projectGroups = groupBy(entries, (e) => e.project_name);
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
    .map((project) => {
      return {
        projectName: project.projectName,
        ...project.totalTimeByLanguage.reduce<Record<string, number>>(
          (acc, curr) => {
            acc[curr.language + "_duration"] = curr.duration;
            return acc;
          },
          {}
        ),
      };
    });

  const maxDuration = Math.max(...totalTimeByProject.map(p => sumBy(p.totalTimeByLanguage, l => l.duration)));
  const ticks = calculateTickValues(maxDuration);

  return (
    <div style={{ height: 350 }}>
      <ResponsiveBar
        data={data}
        keys={[...languageNames.map((l) => `${l}_duration`)]}
        indexBy="projectName"
        margin={{ top: 30, right: 120, bottom: 60, left: 50 }}
        padding={0.3}
        enableGridY
        enableGridX={false}
        theme={{ textColor: usesDarkMode ? "white" : "black" }}
        axisLeft={{
          format: (d: number) => prettyDuration(d),
          tickValues: ticks,
        }}
        borderRadius={2}
        labelSkipHeight={20}
        labelTextColor="black"
        gridYValues={ticks}
        axisBottom={{
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
                .map((l) => (
                  <List.Item key={l}>
                    {prettifyProgrammingLanguageName(l.slice(0, l.length - 9))}:{" "}
                    {prettyDuration(point.data[l] as number)}
                  </List.Item>
                ))}
            </List>
          </Paper>
        )}
        valueFormat={(v) => prettyDuration(v)}
        layout="vertical"
        colors={{ scheme: "paired" }}
        // TODO: Format the values properly instead of the raw "*_duration" format 
        legendLabel={balls => String(balls.id)}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20
          }
        ]}
      />
    </div>
  );
};
