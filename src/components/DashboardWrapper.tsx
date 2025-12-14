"use client";

import { Dashboard } from "./Dashboard";
import { useSettings } from "../hooks/useSettings";
import type { ComponentProps } from "react";

type DashboardWrapperProps = Omit<
  ComponentProps<typeof Dashboard>,
  "smoothCharts"
>;

export const DashboardWrapper = (props: DashboardWrapperProps) => {
  const { smoothCharts } = useSettings();

  return <Dashboard {...props} smoothCharts={smoothCharts} />;
};
