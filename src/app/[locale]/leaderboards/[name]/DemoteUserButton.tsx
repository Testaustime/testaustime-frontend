"use client";

import { Button } from "@mantine/core";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import axios from "../../../../axios";
import { useTranslation } from "react-i18next";

type DemoteUserButtonProps = {
  name: string;
  username: string;
};

export const DemoteUserButton = ({ name, username }: DemoteUserButtonProps) => {
  const { t } = useTranslation();

  const demoteUser = async (username: string) => {
    await axios.post(`/leaderboards/${name}/demote`, {
      username,
    });
  };

  return (
    <Button
      size="xs"
      variant="subtle"
      leftSection={<DoubleArrowDownIcon />}
      color="red"
      onClick={() => {
        demoteUser(username).catch((e) => {
          console.log(e);
        });
      }}
    >
      {t("leaderboards.demote")}
    </Button>
  );
};
