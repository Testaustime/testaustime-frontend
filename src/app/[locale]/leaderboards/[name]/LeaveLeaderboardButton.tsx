"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import ButtonWithConfirmation from "../../../../components/ButtonWithConfirmation";
import { leaveLeaderboard } from "../../../../components/leaderboard/actions";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { logOutAndRedirect } from "../../../../utils/authUtils";
import { PostRequestError } from "../../../../types";

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
            // Using `redirect` will return undefined, but it uses the type `never` so we don't notice it.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (res && "error" in res) {
              switch (res.error) {
                case PostRequestError.Unauthorized:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("errors.unauthorized"),
                  });
                  await logOutAndRedirect();
                  break;
                case PostRequestError.RateLimited:
                  router.push("/rate-limited");
                  break;
                case PostRequestError.UnknownError:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("unknownErrorOccurred"),
                  });
                  break;
              }
            }
          })
          .catch((e: unknown) => {
            console.error(e);
          });
      }}
      disabled={isLastAdmin}
    >
      {t("leaderboards.leaveLeaderboard")}
    </ButtonWithConfirmation>
  );
};
