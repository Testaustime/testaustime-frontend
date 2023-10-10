import {
  Anchor,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  Menu,
  useMantineColorScheme,
} from "@mantine/core";
import {
  EnterIcon,
  ExitIcon,
  FaceIcon,
  GearIcon,
  HomeIcon,
  MixIcon,
  PersonIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { BarChart2 } from "react-feather";
import { useAuthentication } from "../hooks/useAuthentication";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Navigation.module.css";

export interface NavigationProps {
  opened: boolean;
  setOpened: (o: boolean | ((arg0: boolean) => boolean)) => void;
}

export const Navigation = ({ opened, setOpened }: NavigationProps) => {
  const { t } = useTranslation();
  const { isLoggedIn, username, logOut } = useAuthentication();
  const router = useRouter();

  const mantineColorScheme = useMantineColorScheme();

  const logOutAndRedirect = async () => {
    await logOut();
    router.push("/").catch(console.error);
  };

  return (
    <Group>
      <Group spacing={15} align="center" className={styles.navigation}>
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
                    leftIcon={<PersonIcon style={{ marginRight: "5px" }} />}
                  >
                    {username}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t("navbar.account")}</Menu.Label>
                  <Menu.Item
                    component={Link}
                    href="/profile"
                    icon={<GearIcon />}
                  >
                    {t("navbar.settings")}
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    component={Link}
                    href="/extensions"
                    icon={<MixIcon />}
                  >
                    {t("navbar.extensions")}
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="blue"
                    icon={<ExitIcon />}
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
      <Group className={styles.smallNavigation}>
        <Menu
          opened={opened}
          id="dropdown-menu"
          transitionProps={{
            transition: "fade",
            duration: 150,
          }}
          position={"left-end"}
        >
          <Menu.Target>
            <Burger
              title="Open navigation"
              opened={opened}
              color={"#536ab7"}
              sx={{ zIndex: 5 }}
              onClick={() => {
                setOpened((o: boolean) => !o);
              }}
            />
          </Menu.Target>
          <Menu.Dropdown
            className={`${styles.dropdown} noDefaultTransition`}
            onClick={() => {
              setOpened(false);
            }}
          >
            <div
              style={{ padding: "10px" }}
              onClick={() => {
                mantineColorScheme.toggleColorScheme();
              }}
            >
              <ThemeToggle label={true} />
            </div>
            {isLoggedIn ? (
              <>
                <Divider />
                <Menu.Item component={Link} href="/" icon={<HomeIcon />}>
                  {t("navbar.dashboard")}
                </Menu.Item>
                <Menu.Item component={Link} href="/friends" icon={<FaceIcon />}>
                  {t("navbar.friends")}
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  href="/leaderboards"
                  icon={<BarChart2 size={18} />}
                >
                  {t("navbar.leaderboards")}
                </Menu.Item>
                <Divider />
                <Menu.Label>
                  {t("navbar.account")} - {username}
                </Menu.Label>
                <Menu.Item component={Link} href="/profile" icon={<GearIcon />}>
                  {t("navbar.settings")}
                </Menu.Item>
                <Divider />
                <Menu.Item
                  component={Link}
                  href="/extensions"
                  icon={<MixIcon />}
                >
                  {t("navbar.extensions")}
                </Menu.Item>
                <Divider />
                <Menu.Item
                  color="blue"
                  icon={<ExitIcon />}
                  onClick={() => {
                    logOutAndRedirect().catch(console.error);
                  }}
                >
                  {t("navbar.logOut")}
                </Menu.Item>
              </>
            ) : (
              <>
                <Divider />
                <Menu.Item component={Link} href="/login" icon={<EnterIcon />}>
                  {t("navbar.login")}
                </Menu.Item>
                <Menu.Item
                  color="blue"
                  component={Link}
                  href="/register"
                  icon={<PlusIcon />}
                >
                  {t("navbar.register")}
                </Menu.Item>
                <Divider />
                <Menu.Item
                  component={Link}
                  href="/extensions"
                  icon={<MixIcon />}
                >
                  {t("navbar.extensions")}
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};
