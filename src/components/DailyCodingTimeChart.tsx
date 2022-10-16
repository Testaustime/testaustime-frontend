import { Text } from "@mantine/core";
import { format } from "date-fns";
import { addDays, startOfDay } from "date-fns/esm";
import { sumBy } from "../utils/arrayUtils";
import { calculateTickValues } from "../utils/chartUtils";
import { useSettings } from "../hooks/useSettings";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from "chart.js";
import { prettyDuration } from "../utils/dateUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export interface DailyCodingTimeChartProps {
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
  dayCount: number,
  className: string
}

export const DailyCodingTimeChart = ({
  entries,
  dayCount }: DailyCodingTimeChartProps) => {
  const { smoothCharts } = useSettings();

  if (entries.length === 0) return <Text>No data</Text>;

  const data = Array(dayCount)
    .fill(0)
    .map((_, dayIndex) => {
      const date = startOfDay(addDays(new Date(), -dayIndex));
      const duration = sumBy(
        entries.filter(entry => entry.dayStart.getTime() === date.getTime()),
        entry => entry.duration
      );
      return { date, duration };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const maxDuration = [...data].sort((a, b) => b.duration - a.duration)[0].duration;
  const yticks = calculateTickValues(maxDuration);

  return <Line
    options={{
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: item => "  " + prettyDuration(Number(item.raw))
          },
          padding: 8
        }
      },
      scales: {
        y: {
          ticks: {
            count: yticks.length,
            callback: (_, index) => `${yticks[index] / 3600}h`
          }
        }
      }
    }}
    data={{
      labels: data.map(entry => format(entry.date, "MMM d")),
      datasets: [{
        label: "Daily coding time",
        data: data.map(entry => entry.duration),
        borderColor: "#1f78b4",
        borderWidth: 4,
        pointRadius: 2,
        tension: smoothCharts ? 0.5 : 0
      }]
    }}
  />;
};
