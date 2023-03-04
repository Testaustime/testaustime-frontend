import { Checkbox, Group } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useTranslation } from "react-i18next";
export const SmoothChartsSelector = () => {
  const { smoothCharts, setSmoothCharts } = useSettings();
  const { t } = useTranslation();

  return <Group>
    <Checkbox
      checked={smoothCharts}
      onChange={e => setSmoothCharts(e.target.checked)}
      label={t("profile.settings.smoothCharts")}
    />
  </Group>;
};
