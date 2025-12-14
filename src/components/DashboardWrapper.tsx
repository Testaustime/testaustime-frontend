"use client";
import { Dashboard } from "./Dashboard";
import { useSettings } from "../hooks/useSettings";
import { DayRange } from "../utils/dateUtils";


interface DashboardWrapperProps {
  username: string;
  isFrontPage: boolean;
  allEntries: any[];
  defaultDayRange: DayRange;
  locale: string;
  initialActivity: any;
  maxTimeUnit: any;
  smoothChartsSSR: boolean; // pass the SSR value for first render
}

export const DashboardWrapper = ({
  smoothChartsSSR,
  ...props
}: DashboardWrapperProps) => {
  const { smoothCharts } = useSettings();

  // use context value if available, fallback to SSR value
  const effectiveSmoothCharts = smoothCharts ?? smoothChartsSSR;

  return <Dashboard {...props} smoothCharts={effectiveSmoothCharts} />;
};