import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "react-feather";

interface ThemeToggleProps {
  label: boolean
}

function ThemeToggle({ label }: ThemeToggleProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return <div style={{ display: "flex", alignItems: "center" }} onClick={() => toggleColorScheme()}>
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      title="Toggle color scheme"
      style={label === true ? { marginRight: "10px" } : {}}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
    {label === true ? (dark ? "Light mode" : "Dark mode") : ""}
  </div>;
}

export default ThemeToggle;
