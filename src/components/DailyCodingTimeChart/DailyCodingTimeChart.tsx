import { format } from "date-fns";
import { addDays, startOfDay } from "date-fns";
import { sumBy } from "../../utils/arrayUtils";
import { calculateTickValues } from "../../utils/chartUtils";
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
  PointElement,
} from "chart.js";
import { prettyDuration } from "../../utils/dateUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

export interface DailyCodingTimeChartProps {
  data: {
    date: Date;
    duration: number;
  }[];
  smoothCharts: boolean;
}

export const transformData = (
  entries: {
    duration: number;
    dayStart: Date;
  }[],
  dayCount: number,
) => {
  const data = Array(dayCount)
    .fill(0)
    .map((_, dayIndex) => {
      const date = startOfDay(addDays(new Date(), -dayIndex));
      const duration = sumBy(
        entries.filter(
          (entry) => startOfDay(entry.dayStart).getTime() === date.getTime(),
        ),
        (entry) => entry.duration,
      );
      return { date, duration };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return data;
};

export const DailyCodingTimeChart = ({
  data: dataRaw,
  smoothCharts,
}: DailyCodingTimeChartProps) => {
  const data = [...dataRaw].sort((a, b) => a.date.getTime() - b.date.getTime());
  const maxDuration = Math.max(...data.map((d) => d.duration));
  const yticks = calculateTickValues(maxDuration);

  return (
    <Line
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (item) => "  " + prettyDuration(Number(item.raw)),
            },
            padding: 8,
          },
        },
        scales: {
          y: {
            min: 0,
            max: yticks[yticks.length - 1],
            afterBuildTicks: (axis) => {
              axis.ticks = yticks.map((tick) => ({ value: tick }));
            },
            ticks: {
              count: yticks.length,
              stepSize: yticks[1] - yticks[0],
              callback: (_, index) => prettyDuration(yticks[index]),
            },
          },
        },
      }}
      data={{
        labels: data.map((entry) => format(entry.date, "MMM d")),
        datasets: [
          {
            label: "Daily coding time",
            data: data.map((entry) => entry.duration),
            borderColor: "#1f78b4",
            borderWidth: 4,
            pointRadius: 2,
            tension: smoothCharts ? 0.5 : 0,
          },
        ],
      }}
    />
  );
};
