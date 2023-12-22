"use client";

import { useTranslation } from "react-i18next";
import ButtonWithConfirmation from "../../../../components/ButtonWithConfirmation";
import { Trash2 } from "react-feather";
import { deleteLeaderboard } from "../../../../components/leaderboard/actions";
import { DeleteLeaderboardError } from "../../../../types";
import { showNotification } from "@mantine/notifications";
import { logOutAndRedirect } from "../../../../utils/authUtils";
import { useRouter } from "next/navigation";

type DeleteLeaderboardButtonProps = {
  name: string;
};

export const DeleteLeaderboardButton = ({
  name,
}: DeleteLeaderboardButtonProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ButtonWithConfirmation
      color="red"
      size="xs"
      leftSection={<Trash2 size={18} />}
      onClick={() => {
        deleteLeaderboard(name)
          .then(async (res) => {
            if ("error" in res) {
              switch (res.error) {
                case DeleteLeaderboardError.Unauthorized:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("errors.unauthorized"),
                  });
                  await logOutAndRedirect();
                  break;
                case DeleteLeaderboardError.RateLimited:
                  router.push("/rate-limited");
                  break;
                case DeleteLeaderboardError.UnknownError:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("unknownErrorOccurred"),
                  });
                  break;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }}
    >
      {t("leaderboards.deleteLeaderboard")}
    </ButtonWithConfirmation>
  );
};
