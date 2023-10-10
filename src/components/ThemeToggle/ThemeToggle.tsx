import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "react-feather";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
export interface ThemeToggleProps {
  label: boolean;
}

function ThemeToggle({ label }: ThemeToggleProps) {
  const mantineColorScheme = useMantineColorScheme();
  const dark = mantineColorScheme.colorScheme === "dark";

  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      onClick={() => {
        mantineColorScheme.toggleColorScheme();
      }}
    >
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "blue"}
        title={t("theme.toggle")}
        style={label ? { marginRight: "10px" } : {}}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </ActionIcon>
      {label ? (dark ? t("theme.light") : t("theme.dark")) : ""}
    </div>
  );
}

export default ThemeToggle;
