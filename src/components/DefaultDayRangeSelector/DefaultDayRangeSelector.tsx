"use client";

import { Group, SegmentedControl, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { DayRange } from "../../utils/dateUtils";

export const DefaultDayRangeSelector = ({
  texts,
}: {
  texts: {
    label: string;
    options: {
      week: string;
      month: string;
      all: string;
    };
  };
}) => {
  const { defaultDayRange, setDefaultDayRange } = useSettings();

  return (
    <Group>
      <Text>{texts.label}</Text>
      <SegmentedControl
        data={[
          { label: texts.options.week, value: "week" },
          { label: texts.options.month, value: "month" },
          { label: texts.options.all, value: "all" },
        ]}
        value={defaultDayRange}
        onChange={(value) => {
          setDefaultDayRange(value as DayRange);
        }}
      />
    </Group>
  );
};
