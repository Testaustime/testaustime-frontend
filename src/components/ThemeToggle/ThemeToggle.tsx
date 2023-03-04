import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "react-feather";
import { useTranslation } from "next-i18next";
export interface ThemeToggleProps {
  label: boolean
}

function ThemeToggle({ label }: ThemeToggleProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { t } = useTranslation();

  return <div style={{ display: "flex", alignItems: "center" }} onClick={() => toggleColorScheme()}>
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      title={t("theme.toggle")}
      style={label === true ? { marginRight: "10px" } : {}}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
    {label === true ? (dark ? t("theme.light") : t("theme.dark")) : ""}
  </div>;
}

export default ThemeToggle;
