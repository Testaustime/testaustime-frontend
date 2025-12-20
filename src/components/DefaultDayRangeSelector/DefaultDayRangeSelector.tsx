"use client";

import { Group, SegmentedControl, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { DayRange } from "../../utils/dateUtils";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useId } from "react";

export const DefaultDayRangeSelector = () => {
  const { defaultDayRange, setDefaultDayRange } = useSettings();
  const { t } = useTranslation();
  const router = useRouter();

  const id = useId();

  return (
    <Group>
      <label htmlFor={id}>
        <Text>{t("profile.settings.defaultDayRange")}</Text>
      </label>
      <SegmentedControl
        id={id}
        data={[
          { label: t("dashboard.timeFilters.week"), value: "week" },
          { label: t("dashboard.timeFilters.month"), value: "month" },
          { label: t("dashboard.timeFilters.all"), value: "all" },
        ]}
        value={defaultDayRange}
        onChange={(value) => {
          setDefaultDayRange(value as DayRange);

          // Why is this necessary?
          router.refresh();
        }}
      />
    </Group>
  );
};
