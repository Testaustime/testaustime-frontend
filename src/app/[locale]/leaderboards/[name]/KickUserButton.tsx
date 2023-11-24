"use client";

import { Button } from "@mantine/core";
import axios from "../../../../axios";
import { useTranslation } from "react-i18next";

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
        axios
          .post(`/leaderboards/${name}/kick`, {
            username,
          })
          .catch((e) => {
            console.log(e);
          });
      }}
    >
      {t("leaderboards.kick")}
    </Button>
  );
};
