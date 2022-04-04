import { useMantineTheme } from "@mantine/core";
import { format } from "date-fns";
import { addDays, startOfDay } from "date-fns/esm";
import {
  VictoryTheme,
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryThemeDefinition,
  VictoryLabel
} from "victory";
import { sumBy } from "../utils/arrayUtils";
import { calculateTickValues } from "../utils/chartUtils";
import { prettyDuration } from "../utils/dateUtils";

const darkVictoryTheme: VictoryThemeDefinition = {
  scatter: {
    style: {
      data: {
        fill: "#c1c2c5"
      }
    }
  },
  line: {
    style: {
      data: {
        stroke: "#3A6C98",
        strokeWidth: 2
      }
    }
  },
  axis: {
    style: {
      axis: {
        stroke: "#c1c2c5"
      },
      grid: {
        stroke: "#818e99",
        strokeWidth: 1,
        opacity: 0.7
      },
      tickLabels: {
        fill: "#c1c2c5",
        fontSize: 11
      }
    }
  }
};

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

  const maxDuration = data.sort((a, b) => b.duration - a.duration)[0].duration;

  return (
    <VictoryChart
      theme={
        !usesDarkMode
          ? {
              ...VictoryTheme.grayscale,
              axis: { style: { tickLabels: { fontSize: 11 } } }
            }
          : darkVictoryTheme
      }
      padding={{ left: 30, bottom: 30, top: 15, right: 30 }}
      scale={{ x: "time" }}
      containerComponent={<VictoryVoronoiContainer />}
    >
      <VictoryAxis
        tickFormat={(d) => format(new Date(d), "d.M.")}
        tickLabelComponent={<VictoryLabel dy={10} />}
      />
      <VictoryAxis
        tickFormat={() => ""}
        tickCount={28}
        style={{ grid: { opacity: 0.2 } }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(tick) => prettyDuration(tick)}
        tickLabelComponent={<VictoryLabel dx={-10} />}
        tickValues={calculateTickValues(maxDuration)}
      />
      <VictoryGroup
        data={data.map(({ date, duration }) => ({ x: date, y: duration }))}
        labels={(d) =>
          `${format(d.datum.x, "d.M.yyyy")}\n${prettyDuration(d.datum.y)}`
        }
        labelComponent={
          <VictoryTooltip
            flyoutPadding={{ left: 10, right: 10, top: 3, bottom: 3 }}
            style={{ fontSize: 10 }}
          />
        }
      >
        <VictoryLine />
        <VictoryScatter size={({ active }) => (active ? 6 : 3)} />
      </VictoryGroup>
    </VictoryChart>
  );
};
