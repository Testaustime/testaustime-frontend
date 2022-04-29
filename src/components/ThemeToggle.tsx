import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun } from "react-feather";
import { MoonStars } from "tabler-icons-react";

function ThemeToggle({ label }: {label: boolean}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return <div style={{ display: "flex", alignItems: "center" }} onClick={() => toggleColorScheme()}>
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      title="Toggle color scheme"
      style={ label === true ? { marginRight: "10px"} : {} }
    >
      {dark ? <Sun size={18} /> : <MoonStars size={18} />}
    </ActionIcon>
    { label === true ? ( dark ? "Light mode" : "Dark mode" ) : "" }
  </div>;
}

export default ThemeToggle;
