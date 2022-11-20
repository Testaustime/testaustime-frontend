import { Group, SegmentedControl, Text } from "@mantine/core";
import { useSettings } from "../../hooks/useSettings";
import { useI18nContext } from "../../i18n/i18n-react";
import { Locales } from "../../i18n/i18n-types";

export const LanguageSelector = () => {
  const { LL } = useI18nContext();
  const { language, setLanguage } = useSettings();

  return <Group>
    <Text>{LL.profile.settings.language()}</Text>
    <SegmentedControl
      data={[
        { label: "English 🇺🇸", value: "en" },
        { label: "Suomi 🇫🇮", value: "fi" }
      ]}
      value={language}
      onChange={value => setLanguage(value as Locales)}
    />
  </Group>;
};
