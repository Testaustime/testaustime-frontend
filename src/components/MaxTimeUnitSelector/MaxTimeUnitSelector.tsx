"use client";

import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { Group, Select, Text } from "@mantine/core";
import { TimeUnit, timeUnits } from "../../utils/dateUtils";
import { useId } from "react";

export const MaxTimeUnitSelector = () => {
  const { maxTimeUnit, setMaxTimeUnit } = useSettings();
  const { t } = useTranslation();

  const id = useId();

  return (
    <Group>
      <label htmlFor={id}>
        <Text>{t("profile.settings.timeUnits.label")}</Text>
      </label>
      <Select
        id={id}
        value={maxTimeUnit}
        data={timeUnits.map((x) => ({
          value: x.suffix,
          label: t(`profile.settings.timeUnits.${x.suffix}`),
        }))}
        onChange={(v) => {
          if (v) {
            setMaxTimeUnit(v as unknown as TimeUnit);
          }
        }}
      />
    </Group>
  );
};
