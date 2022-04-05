import { Paper, Text, useMantineTheme } from "@mantine/core";
import { format } from "date-fns";
import { addDays, isSunday, startOfDay } from "date-fns/esm";
import { sumBy } from "../utils/arrayUtils";
import { ResponsiveLine } from "@nivo/line";
import { calculateTickValues } from "../utils/chartUtils";
import { prettyDuration } from "../utils/dateUtils";
import { useSettings } from "../hooks/useSettings";

export interface DailyCodingTimeChartProps {
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
  dayCount: number;
}

export const DailyCodingTimeChart = ({
  entries,
  dayCount
}: DailyCodingTimeChartProps) => {
  const usesDarkMode = useMantineTheme().colorScheme === "dark";
  const { smoothCharts } = useSettings();

  if (entries.length === 0) return <Text>No data</Text>;

  const data = Array(dayCount)
    .fill(0)
    .map((_, dayIndex) => {
      const date = startOfDay(addDays(new Date(), -dayIndex));
      const duration = sumBy(
        entries.filter((entry) => entry.dayStart.getTime() === date.getTime()),
        (entry) => entry.duration
      );
      return { date, duration };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const maxDuration = [...data].sort((a, b) => b.duration - a.duration)[0].duration;
  const yticks = calculateTickValues(maxDuration);

  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={[{
          id: "daily-coding-time",
          data: data.map(({ date, duration }) => ({
            x: date,
            y: duration
          }))
        }]}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{
          type: "time",
          precision: "day",
          min: data[0].date,
          max: data[data.length - 1].date,
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: yticks[yticks.length - 1]
        }}
        curve={smoothCharts ? "monotoneX" : "linear"}
        axisBottom={{
          format: (date) => {
            if (dayCount <= 14) return format(date, "d.M.");
            return isSunday(date) ? format(date, "d.M.") : "";
          },
          tickValues: data.map(({ date }) => date),
        }}
        axisLeft={{
          format: (durationSeconds) => prettyDuration(durationSeconds),
          tickValues: yticks,
        }}
        gridXValues={data.map(({ date }) => date)}
        gridYValues={yticks}
        sliceTooltip={(p) => {
          const { x, y } = p.slice.points[0].data as { x: Date; y: number };
          return (
            <Paper p={10} sx={theme => ({ backgroundColor: theme.white, color: theme.black })}>
              <Text>{format(x, "d.M.yyyy")}</Text>
              <Text>{prettyDuration(y)}</Text>
            </Paper>
          );
        }}
        useMesh
        enableSlices="x"
        pointLabelYOffset={0}
        pointSize={12}
        theme={{
          textColor: usesDarkMode ? "#fff" : "#000",
          crosshair: {
            line: {
              stroke: usesDarkMode ? "#fff" : "#555",
              strokeWidth: 3,
            }
          }
        }}
        colors={{
          scheme: usesDarkMode ? "paired" : "category10"
        }}
      />
    </div>
  );
};
