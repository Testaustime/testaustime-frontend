"use client";

import { Button, Divider, Menu } from "@mantine/core";
import { ExitIcon, GearIcon, MixIcon, PersonIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logOut } from "../utils/authUtils";

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
          prefetch={false}
        >
          {texts.settings}
        </Menu.Item>
        <Divider />
        <Menu.Item
          component={Link}
          href={`/${locale}/extensions`}
          leftSection={<MixIcon />}
          prefetch={false}
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
