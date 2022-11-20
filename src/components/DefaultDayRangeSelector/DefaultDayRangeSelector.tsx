import { Group, SegmentedControl, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useI18nContext } from "../../i18n/i18n-react";
import { DayRange } from "../../utils/dateUtils";

export const DefaultDayRangeSelector = () => {
  const { defaultDayRange, setDefaultDayRange } = useSettings();
  const { LL } = useI18nContext();

  return <Group>
    <Text>{LL.profile.settings.defaultDayRange()}</Text>
    <SegmentedControl
      data={[
        { label: LL.dashboard.timeFilters.week(), value: "week" },
        { label: LL.dashboard.timeFilters.month(), value: "month" },
        { label: LL.dashboard.timeFilters.all(), value: "all" }
      ]}
      value={defaultDayRange}
      onChange={value => setDefaultDayRange(value as DayRange)}
    />
  </Group>;
};
