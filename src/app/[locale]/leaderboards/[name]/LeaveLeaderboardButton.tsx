"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import ButtonWithConfirmation from "../../../../components/ButtonWithConfirmation";
import { leaveLeaderboard } from "../../../../components/leaderboard/actions";
import { useTranslation } from "react-i18next";
import { LeaveLeaderboardError } from "../../../../types";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { logOutAndRedirect } from "../../../../utils/authUtils";

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
  const router = useRouter();

  return (
    <ButtonWithConfirmation
      color="red"
      size="xs"
      leftSection={<ExitIcon />}
      onClick={() => {
        leaveLeaderboard(name)
          .then(async (res) => {
            if ("error" in res) {
              switch (res.error) {
                case LeaveLeaderboardError.Unauthorized:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("errors.unauthorized"),
                  });
                  await logOutAndRedirect();
                  break;
                case LeaveLeaderboardError.RateLimited:
                  router.push("/rate-limited");
                  break;
                case LeaveLeaderboardError.UnknownError:
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
            console.error(e);
          });
      }}
      disabled={isLastAdmin}
    >
      {t("leaderboards.leaveLeaderboard")}
    </ButtonWithConfirmation>
  );
};
