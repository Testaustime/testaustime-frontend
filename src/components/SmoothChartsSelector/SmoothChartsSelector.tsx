"use client";

import { Checkbox, Group, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useTranslation } from "react-i18next";
import { useId } from "react";

export const SmoothChartsSelector = () => {
  const { smoothCharts, setSmoothCharts } = useSettings();
  const { t } = useTranslation();

  const id = useId();

  return (
    <Group>
      <label htmlFor={id}>
        <Text>{t("profile.settings.smoothCharts")}</Text>
      </label>
      <Checkbox
        id={id}
        checked={smoothCharts}
        onChange={(e) => {
          setSmoothCharts(e.target.checked);
        }}
      />
    </Group>
  );
};
