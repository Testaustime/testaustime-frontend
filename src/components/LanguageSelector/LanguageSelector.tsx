import { Group, MantineSize, SegmentedControl, Select, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useTranslation } from "react-i18next";
import i18n, { Locales } from "../../i18n/i18n";

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
  const { t } = useTranslation();
  const locale = i18n.resolvedLanguage;
  const { setLanguage } = useSettings();

  const data = [
    { label: "🇺🇸 English", value: "en" },
    { label: "🇫🇮 Suomi", value: "fi" }
  ];

  const onChange = (value: string) => setLanguage(value as Locales);
  const Component = type === "segmented" ? <SegmentedControl
    size={size}
    data={data}
    value={locale}
    onChange={onChange}
  /> : <Select
    size={size}
    data={data}
    value={locale}
    onChange={onChange}
    style={{ width: 150 }}
  />;

  return showLabel ? <Group>
    {<Text>{t("profile.settings.language")}</Text>}
    {Component}
  </Group> : Component;
};
