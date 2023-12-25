import { Anchor, Box, Button, Group } from "@mantine/core";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import Link from "next/link";
import styles from "./Navigation.module.css";
import { TFunction } from "i18next";
import { NavigationMenuDropdown } from "./NavigationMenuDropdown";
import { UserSearch } from "./UserSearch/UserSearch";

type NavigationProps = {
  isLoggedIn: boolean;
  username?: string;
  t: TFunction;
  locale: string;
};

export const Navigation = ({
  isLoggedIn,
  username,
  t,
  locale,
}: NavigationProps) => {
  return (
    <Group>
      <Group gap={15} align="center" className={styles.navigation}>
        <Group>
          {isLoggedIn ? (
            <>
              <Anchor component={Link} href={`/${locale}`} prefetch={false}>
                {t("navbar.dashboard")}
              </Anchor>
              <Anchor
                component={Link}
                href={`/${locale}/friends`}
                prefetch={false}
              >
                {t("navbar.friends")}
              </Anchor>
              <Anchor
                component={Link}
                href={`/${locale}/leaderboards`}
                prefetch={false}
              >
                {t("navbar.leaderboards")}
              </Anchor>
              <UserSearch />
              <NavigationMenuDropdown username={username} locale={locale} />
            </>
          ) : (
            <>
              <Anchor
                component={Link}
                href={`/${locale}/extensions`}
                prefetch={false}
              >
                {t("navbar.extensions")}
              </Anchor>
              <Box className={styles.spacer} />
              <Anchor
                component={Link}
                href={`/${locale}/login`}
                prefetch={false}
              >
                {t("navbar.login")}
              </Anchor>
              <Button
                component={Link}
                href={`/${locale}/register`}
                prefetch={false}
              >
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
