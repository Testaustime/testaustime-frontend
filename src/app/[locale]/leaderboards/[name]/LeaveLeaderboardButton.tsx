"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import ButtonWithConfirmation from "../../../../components/ButtonWithConfirmation";
import { leaveLeaderboard } from "../../../../components/leaderboard/actions";
import { useTranslation } from "react-i18next";

type LeaveLeaderboardButtonProps = {
  name: string;
  username: string;
  isLastAdmin: boolean;
};

export const LeaveLeaderboardButton = ({
  name,
  isLastAdmin,
}: LeaveLeaderboardButtonProps) => {
  const { t } = useTranslation();

  return (
    <ButtonWithConfirmation
      color="red"
      size="xs"
      leftSection={<ExitIcon />}
      onClick={() => {
        leaveLeaderboard(name).catch((e) => {
          console.log(e);
        });
      }}
      disabled={isLastAdmin}
    >
      {t("leaderboards.leaveLeaderboard")}
    </ButtonWithConfirmation>
  );
};
