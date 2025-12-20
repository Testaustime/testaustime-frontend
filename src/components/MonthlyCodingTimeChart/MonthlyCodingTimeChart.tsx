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
import { addMonths, format, startOfMonth } from "date-fns";
import { sumBy } from "../../utils/arrayUtils";
import { calculateTickValues } from "../../utils/chartUtils";
import { Line } from "react-chartjs-2";
import { prettyDuration, TimeUnit } from "../../utils/dateUtils";

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

type MonthlyCodingTimeChartProps = {
  data: {
    month: Date;
    duration: number;
  }[];
  smoothCharts: boolean;
  maxTimeUnit: TimeUnit;
};

export const transformData = (
  entries: {
    duration: number;
    dayStart: Date;
  }[],
) => {
  const earliestMonth = Math.min(
    ...entries.map((e) => startOfMonth(e.dayStart).getTime()),
  );

  // Not exact but should be good enough
  const monthCount = Math.floor(
    (new Date().getTime() - earliestMonth) / (1000 * 3600 * 24 * 30),
  );

  const data = Array(monthCount)
    .fill(0)
    .map((_, monthIndex) => {
      const month = startOfMonth(addMonths(new Date(), -monthIndex));
      const duration = sumBy(
        entries.filter(
          (entry) => startOfMonth(entry.dayStart).getTime() === month.getTime(),
        ),
        (entry) => entry.duration,
      );
      return { month, duration };
    })
    .sort((a, b) => a.month.getTime() - b.month.getTime());

  return data;
};

export const MonthlyCodingTimeChart = ({
  data: dataRaw,
  smoothCharts,
  maxTimeUnit,
}: MonthlyCodingTimeChartProps) => {
  const data = [...dataRaw].sort(
    (a, b) => a.month.getTime() - b.month.getTime(),
  );
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
              label: (item) =>
                "  " + prettyDuration(Number(item.raw), maxTimeUnit),
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
              callback: (_, index) =>
                prettyDuration(yticks[index], maxTimeUnit),
            },
          },
        },
      }}
      data={{
        labels: data.map((entry) => format(entry.month, "MMM Y")),
        datasets: [
          {
            label: "Monthly coding time",
            data: data.map((entry) => entry.duration),
            borderColor: "#1f78b4",
            borderWidth: 4,
            // Avoid sharp "miter" spikes at vertices when drawing straight segments.
            borderJoinStyle: "round",
            borderCapStyle: "round",
            pointRadius: 2,
            // Avoid "overshoot" where the smoothed curve goes above/below actual points.
            cubicInterpolationMode: smoothCharts ? "monotone" : "default",
            tension: smoothCharts ? 0.5 : 0,
          },
        ],
      }}
    />
  );
};
