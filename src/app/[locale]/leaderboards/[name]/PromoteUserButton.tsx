"use client";

import { Button } from "@mantine/core";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { promoteUser } from "./actions";

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
        void promoteUser(username, name);
      }}
    >
      {t("leaderboards.promote")}
    </Button>
  );
};
