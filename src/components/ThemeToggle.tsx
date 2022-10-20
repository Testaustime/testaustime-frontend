import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "react-feather";
import { useI18nContext } from "../i18n/i18n-react";

interface ThemeToggleProps {
  label: boolean
}

function ThemeToggle({ label }: ThemeToggleProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { LL } = useI18nContext();

  return <div style={{ display: "flex", alignItems: "center" }} onClick={() => toggleColorScheme()}>
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      title={LL.theme.toggle()}
      style={label === true ? { marginRight: "10px" } : {}}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
    {label === true ? LL.theme[dark ? "light" : "dark"]() : ""}
  </div>;
}

export default ThemeToggle;
