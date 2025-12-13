"use client";

import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { Checkbox, Group } from "@mantine/core";

export const TimeInHoursSelector = () => {
  const { timeInHours, setTimeInHours } = useSettings();
  const { t } = useTranslation();

  return (
    <Group>
      <Checkbox
        checked={timeInHours}
        onChange={(e) => {
          setTimeInHours(e.target.checked);
        }}
        label={t("profile.settings.timeInHours")}
      />
    </Group>
  );
};
