"use client";

import { useTranslation } from "react-i18next";
import ButtonWithConfirmation from "../../../../components/ButtonWithConfirmation";
import { Trash2 } from "react-feather";
import { deleteLeaderboard } from "../../../../components/leaderboard/actions";
import { showNotification } from "@mantine/notifications";
import { logOutAndRedirect } from "../../../../utils/authUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostRequestError } from "../../../../types";

type DeleteLeaderboardButtonProps = {
  name: string;
};

export const DeleteLeaderboardButton = ({
  name,
}: DeleteLeaderboardButtonProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <ButtonWithConfirmation
      color="red"
      size="xs"
      leftSection={<Trash2 size={18} />}
      loading={isDeleting}
      onClick={() => {
        setIsDeleting(true);
        deleteLeaderboard(name)
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
            } else {
              showNotification({
                title: t("leaderboards.deletionNotification.successTitle"),
                color: "green",
                message: t(
                  "leaderboards.deletionNotification.successDescription",
                ),
              });
            }
          })
          .catch((e: unknown) => {
            console.log(e);
          })
          .finally(() => {
            setIsDeleting(false);
          });
      }}
    >
      {t("leaderboards.deleteLeaderboard")}
    </ButtonWithConfirmation>
  );
};
