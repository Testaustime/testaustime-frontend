"use client";

import { useTranslation } from "react-i18next";
import ButtonWithConfirmation from "../../../../components/ButtonWithConfirmation";
import { Trash2 } from "react-feather";
import { deleteLeaderboard } from "../../../../components/leaderboard/actions";

type DeleteLeaderboardButtonProps = {
  name: string;
  username: string;
};

export const DeleteLeaderboardButton = ({
  name,
  username,
}: DeleteLeaderboardButtonProps) => {
  const { t } = useTranslation();

  return (
    <ButtonWithConfirmation
      color="red"
      size="xs"
      leftSection={<Trash2 size={18} />}
      onClick={() => {
        deleteLeaderboard(name, username).catch((e) => {
          console.log(e);
        });
      }}
    >
      {t("leaderboards.deleteLeaderboard")}
    </ButtonWithConfirmation>
  );
};
