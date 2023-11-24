"use client";

import { Button } from "@mantine/core";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";
import axios from "../../../../axios";
import { useTranslation } from "react-i18next";

type PromoteUserButtonProps = {
  name: string;
  username: string;
};

export const PromoteUserButton = ({
  name,
  username,
}: PromoteUserButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      size="xs"
      variant="subtle"
      leftSection={<DoubleArrowUpIcon />}
      color="green"
      onClick={() => {
        axios
          .post(`/leaderboards/${name}/promote`, {
            username,
          })
          .catch((e) => {
            console.log(e);
          });
      }}
    >
      {t("leaderboards.promote")}
    </Button>
  );
};
