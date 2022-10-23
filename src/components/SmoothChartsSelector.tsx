import { Checkbox, Group } from "@mantine/core";
import { useSettings } from "../hooks/useSettings";
import { useI18nContext } from "../i18n/i18n-react";

export const SmoothChartsSelector = () => {
  const { smoothCharts, setSmoothCharts } = useSettings();
  const { LL } = useI18nContext();

  return <Group>
    <Checkbox
      checked={smoothCharts}
      onChange={e => setSmoothCharts(e.target.checked)}
      label={LL.profile.settings.smoothCharts()}
    />
  </Group>;
};
