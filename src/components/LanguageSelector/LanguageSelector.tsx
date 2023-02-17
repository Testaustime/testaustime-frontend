import { Group, MantineSize, SegmentedControl, Select, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useI18nContext } from "../../i18n/i18n-react";
import { Locales } from "../../i18n/i18n-types";

export type LanguageSelectorType = "segmented" | "dropdown"

export type LanguageSelectorProps = {
  type?: LanguageSelectorType,
  showLabel?: boolean,
  size?: MantineSize
}

export const LanguageSelector = ({
  type = "segmented",
  showLabel = true,
  size
}: LanguageSelectorProps) => {
  const { LL, locale } = useI18nContext();
  const { language, setLanguage } = useSettings();

  const data = [
    { label: "🇺🇸 English", value: "en" },
    { label: "🇫🇮 Suomi", value: "fi" }
  ];

  const onChange = (value: string) => setLanguage(value as Locales);
  const Component = type === "segmented" ? <SegmentedControl
    size={size}
    data={data}
    value={language || locale}
    onChange={onChange}
  /> : <Select
    size={size}
    data={data}
    value={language || locale}
    onChange={onChange}
    style={{ width: 150 }}
  />;

  return showLabel ? <Group>
    {<Text>{LL.profile.settings.language()}</Text>}
    {Component}
  </Group> : Component;
};
