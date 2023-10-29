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

export type LanguageSelectorType = "segmented" | "dropdown";

export type LanguageSelectorProps = {
  locale: string;
  type?: LanguageSelectorType;
  showLabel?: boolean;
  size?: MantineSize;
  texts: {
    label: string;
  };
};

export const LanguageSelector = ({
  locale,
  type = "segmented",
  showLabel = true,
  size,
  texts,
}: LanguageSelectorProps) => {
  const { setLanguage } = useSettings();

  const data = [
    { label: "🇺🇸 English", value: "en" },
    { label: "🇫🇮 Suomi", value: "fi" },
  ];

  const onChange = (value: string) => {
    setLanguage(value as Locales);
  };

  const Component =
    type === "segmented" ? (
      <SegmentedControl
        size={size}
        data={data}
        value={locale}
        onChange={onChange}
      />
    ) : (
      <Select
        size={size}
        data={data}
        value={locale}
        onChange={onChange}
        style={{ width: 150 }}
      />
    );

  return showLabel ? (
    <Group>
      {<Text>{texts.label}</Text>}
      {Component}
    </Group>
  ) : (
    Component
  );
};
