import { createStyles, Grid, List, Paper, Text, useMantineTheme } from "@mantine/core";
import { ResponsiveBar } from "@nivo/bar";
import { Square } from "react-feather";
import { groupBy, sumBy } from "../utils/arrayUtils";
import { calculateTickValues } from "../utils/chartUtils";
import { prettyDuration } from "../utils/dateUtils";
import { prettifyProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import { colors } from "../colors";

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

const useStyles = createStyles(() => ({
  legend: {
    height: "max-content",
    minHeight: "30px",
    width: "90%",
    margin: "5px 5% 0% 5%",
    justifyContent: "center"
  },
  legendItem: {
    padding: "12px"
  },
  legendIcon: {
    marginRight: "3px"
  }
}));

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
  "#b15928"
];

const chosenRandomColors: Record<string, string> = {};

function getLanguageColor(str: string): string {
  let language = str.toLowerCase();
  if (language === undefined) throw new Error("Invalid language name provided");
  // If the name has multiple parts, try to resolve each one to a color and prioritize first matches
  if (language.split(" ").length > 1 && colors[language] === undefined) {
    language = language.split(" ")
      .filter((possibleName: string) => colors[possibleName] !== undefined)[0];
  }
  if (colors[language] === undefined) {
    if (chosenRandomColors[language] === undefined)
      chosenRandomColors[language] = defaultColors[Math.floor(defaultColors.length * Math.random())];
    return chosenRandomColors[language];
  }
  return colors[language];
}

export const PerProjectChart = ({ entries, projectCount = 5, className }: PerProjectChartProps) => {
  const usesDarkMode = useMantineTheme().colorScheme === "dark";
  const { classes } = useStyles();

  if (entries.length === 0) return <Text>No data</Text>;

  let languageNames = entries
    .sort((entry1, entry2) => entry2.duration - entry1.duration)
    .map(entry => entry.language || "other")
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 9);
  languageNames.push("other");
  languageNames = languageNames.reverse();

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
    .sort((a, b) => sumBy(b.totalTimeByLanguage, e => e.duration) - sumBy(a.totalTimeByLanguage, e => e.duration))
    .slice(0, projectCount)
    .map(project => ({
      projectName: project.projectName,
      ...project.totalTimeByLanguage.reduce<Record<string, number>>((acc, { language, duration }) => {
        const k = languageNames.includes(language) ? language : "other";
        return {
          ...acc,
          [k + "_duration"]: (acc[k + "_duration"] ?? 0) + duration
        };
      }, {})
    })).reverse();

  const maxDuration = Math.max(...totalTimeByProject.map(p => sumBy(p.totalTimeByLanguage, l => l.duration)));
  const ticks = calculateTickValues(maxDuration);

  const longestProjectName = totalTimeByProject
    .slice()
    .map(project => project.projectName).sort((a, b) => b.length - a.length)[0];

  return (
    <div className={className}>
      <div style={{ height: 110 * Math.min(totalTimeByProject.length, projectCount), width: "100%" }}>
        <ResponsiveBar
          data={data}
          keys={[...languageNames.map(l => `${l}_duration`)]}
          labelSkipWidth={10}
          indexBy="projectName"
          margin={{
            top: 30,
            right: (window.innerWidth > 740 ? window.innerWidth * 0.05 : 0),
            bottom: 30,
            left: (window.innerWidth > 740 ? window.innerWidth * 0.05 : 0)
             + (longestProjectName.length > 8 ? longestProjectName.length * 6 : 0)
          }}
          padding={0.3}
          enableGridX
          enableGridY={false}
          maxValue={ticks[ticks.length - 1]}
          theme={{ textColor: usesDarkMode ? "white" : "black" }}
          axisBottom={{
            format: (d: number) => prettyDuration(d),
            tickValues: ticks
          }}
          borderRadius={2}
          labelSkipHeight={20}
          labelTextColor="black"
          gridXValues={ticks}
          axisLeft={{
            tickPadding: 8
          }}
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
                  .reverse()
                  .map(l => (
                    <List.Item key={l}>
                      {prettifyProgrammingLanguageName(l.slice(0, l.length - 9)) ?? "Unknown"}:{" "}
                      {prettyDuration(Number(point.data[l]))}
                    </List.Item>
                  ))}
              </List>
            </Paper>
          )}
          valueFormat={v => prettyDuration(v)}
          layout="horizontal"
          // colors={{ scheme: "paired" }}
          // eslint-disable-next-line max-len
          colors={l => getLanguageColor(prettifyProgrammingLanguageName(l.id.toString().slice(0, l.id.toString().length - 9)) ?? "Unknown")}
          // TODO: Format the values properly instead of the raw "*_duration" format
          legendLabel={datum => {
            const str = String(datum.id);
            return prettifyProgrammingLanguageName(str.slice(0, str.length - 9)) ?? "Unknown";
          }}
        />
      </div>
      <Grid grow className={classes.legend}>
        {[...languageNames.map(l =>
          <>
            <Grid className={classes.legendItem}>
              <Square
                fill={getLanguageColor(prettifyProgrammingLanguageName(l) ?? l)}
                color={getLanguageColor(prettifyProgrammingLanguageName(l) ?? l)}
                className={classes.legendIcon}
              />
              {prettifyProgrammingLanguageName(l)}
            </Grid>
          </>
        )]}
      </Grid>
    </div>
  );
};
