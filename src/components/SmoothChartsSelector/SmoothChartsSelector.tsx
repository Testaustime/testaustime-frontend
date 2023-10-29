"use client";

import { Checkbox, Group } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";

export const SmoothChartsSelector = ({
  texts,
}: {
  texts: {
    smoothCharts: string;
  };
}) => {
  const { smoothCharts, setSmoothCharts } = useSettings();

  return (
    <Group>
      <Checkbox
        checked={smoothCharts}
        onChange={(e) => {
          setSmoothCharts(e.target.checked);
        }}
        label={texts.smoothCharts}
      />
    </Group>
  );
};
