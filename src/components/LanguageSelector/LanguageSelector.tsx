"use client";

import {
  Group,
  MantineSize,
  SegmentedControl,
  Select,
  Text,
} from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { Locales } from "../../i18next";
import { useTranslation } from "react-i18next";
import { useId } from "react";

type LanguageSelectorType = "segmented" | "dropdown";

export type LanguageSelectorProps = {
  locale: string;
  type?: LanguageSelectorType;
  showLabel?: boolean;
  size?: MantineSize;
};

export const LanguageSelector = ({
  locale,
  type = "segmented",
  showLabel = true,
  size,
}: LanguageSelectorProps) => {
  const { setLanguage } = useSettings();
  const { t } = useTranslation();

  const id = useId();

  const data = [
    { label: "English", value: "en" },
    { label: "Suomi", value: "fi" },
  ];

  const onChange = (value: string | null) => {
    if (!value) return;
    setLanguage(value as Locales);
  };

  const Component =
    type === "segmented" ? (
      <SegmentedControl
        id={id}
        size={size}
        data={data}
        value={locale}
        onChange={onChange}
      />
    ) : (
      <Select
        id={id}
        size={size}
        data={data}
        value={locale}
        onChange={onChange}
        style={{ width: 150 }}
      />
    );

  return showLabel ? (
    <Group>
      <label htmlFor={id}>
        <Text>{t("profile.settings.language")}</Text>
      </label>
      {Component}
    </Group>
  ) : (
    Component
  );
};
