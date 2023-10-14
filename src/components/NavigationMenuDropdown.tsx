"use client";

import { Button, Divider, Menu } from "@mantine/core";
import { ExitIcon, GearIcon, MixIcon, PersonIcon } from "@radix-ui/react-icons";
import { useAuthentication } from "../hooks/useAuthentication";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type NavigationMenuDropdownProps = {
  username: string | undefined;
  texts: {
    account: string;
    settings: string;
    extensions: string;
    logOut: string;
  };
  locale: string;
};

export const NavigationMenuDropdown = ({
  username,
  texts,
  locale,
}: NavigationMenuDropdownProps) => {
  const { logOut } = useAuthentication();
  const router = useRouter();

  const logOutAndRedirect = async () => {
    await logOut();
    router.push("/");
  };

  return (
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
        <Menu.Label>{texts.account}</Menu.Label>
        <Menu.Item
          component={Link}
          href={`/${locale}/profile`}
          leftSection={<GearIcon />}
        >
          {texts.settings}
        </Menu.Item>
        <Divider />
        <Menu.Item
          component={Link}
          href={`/${locale}/extensions`}
          leftSection={<MixIcon />}
        >
          {texts.extensions}
        </Menu.Item>
        <Divider />
        <Menu.Item
          color="blue"
          leftSection={<ExitIcon />}
          onClick={() => {
            logOutAndRedirect().catch(console.error);
          }}
        >
          {texts.logOut}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
