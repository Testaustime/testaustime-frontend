import { Anchor, Box, Button, Divider, Group, Menu } from "@mantine/core";
import { ExitIcon, GearIcon, MixIcon, PersonIcon } from "@radix-ui/react-icons";
import { useAuthentication } from "../hooks/useAuthentication";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Navigation.module.css";

export type NavigationProps = {
  isLoggedIn: boolean;
  username?: string;
};

export const Navigation = ({ isLoggedIn, username }: NavigationProps) => {
  const { t } = useTranslation();
  const { logOut } = useAuthentication();
  const router = useRouter();

  const logOutAndRedirect = async () => {
    await logOut();
    router.push("/").catch(console.error);
  };

  return (
    <Group>
      <Group gap={15} align="center" className={styles.navigation}>
        <Group>
          {isLoggedIn ? (
            <>
              <Anchor component={Link} href="/">
                {t("navbar.dashboard")}
              </Anchor>
              <Anchor component={Link} href="/friends">
                {t("navbar.friends")}
              </Anchor>
              <Anchor component={Link} href="/leaderboards">
                {t("navbar.leaderboards")}
              </Anchor>
              <Menu trigger="hover">
                <Menu.Target>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<PersonIcon style={{ marginRight: "5px" }} />}
                  >
                    {username}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t("navbar.account")}</Menu.Label>
                  <Menu.Item
                    component={Link}
                    href="/profile"
                    leftSection={<GearIcon />}
                  >
                    {t("navbar.settings")}
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    component={Link}
                    href="/extensions"
                    leftSection={<MixIcon />}
                  >
                    {t("navbar.extensions")}
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="blue"
                    leftSection={<ExitIcon />}
                    onClick={() => {
                      logOutAndRedirect().catch(console.error);
                    }}
                  >
                    {t("navbar.logOut")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <>
              <Anchor component={Link} href="/extensions">
                {t("navbar.extensions")}
              </Anchor>
              <Box className={styles.spacer} />
              <Anchor component={Link} href="/login">
                {t("navbar.login")}
              </Anchor>
              <Button component={Link} href="/register">
                {t("navbar.register")}
              </Button>
            </>
          )}
        </Group>
        <ThemeToggle label={false} />
      </Group>
    </Group>
  );
};
