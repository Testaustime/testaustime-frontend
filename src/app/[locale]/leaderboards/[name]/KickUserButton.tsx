"use client";

import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { kickUser } from "./actions";

type KickUserButtonProps = {
  name: string;
  username: string;
};

export const KickUserButton = ({ name, username }: KickUserButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      size="xs"
      variant="subtle"
      color="red"
      onClick={() => {
        void kickUser(username, name);
      }}
    >
      {t("leaderboards.kick")}
    </Button>
  );
};
