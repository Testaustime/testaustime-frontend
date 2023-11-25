"use client";

import { Button } from "@mantine/core";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { demoteUser } from "./actions";

type DemoteUserButtonProps = {
  name: string;
  username: string;
};

export const DemoteUserButton = ({ name, username }: DemoteUserButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      size="xs"
      variant="subtle"
      leftSection={<DoubleArrowDownIcon />}
      color="red"
      onClick={() => {
        demoteUser(username, name).catch((e) => {
          console.log(e);
        });
      }}
    >
      {t("leaderboards.demote")}
    </Button>
  );
};
