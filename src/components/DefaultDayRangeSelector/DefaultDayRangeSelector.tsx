import { Group, SegmentedControl, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useTranslation } from "next-i18next";
import { DayRange } from "../../utils/dateUtils";

export const DefaultDayRangeSelector = () => {
  const { defaultDayRange, setDefaultDayRange } = useSettings();
  const { t } = useTranslation();

  return (
    <Group>
      <Text>{t("profile.settings.defaultDayRange")}</Text>
      <SegmentedControl
        data={[
          { label: t("dashboard.timeFilters.week"), value: "week" },
          { label: t("dashboard.timeFilters.month"), value: "month" },
          { label: t("dashboard.timeFilters.all"), value: "all" },
        ]}
        value={defaultDayRange}
        onChange={(value) => {
          setDefaultDayRange(value as DayRange);
        }}
      />
    </Group>
  );
};
