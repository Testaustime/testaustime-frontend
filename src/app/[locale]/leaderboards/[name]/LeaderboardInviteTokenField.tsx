"use client";

import { useRouter } from "next/navigation";
import TokenField from "../../../../components/TokenField";
import { regenerateInviteCode } from "./actions";
import { RegenerateInviteCodeError } from "../../../../types";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { logOutAndRedirect } from "../../../../utils/authUtils";

type LeaderboardInviteTokenFieldProps = {
  leaderboardName: string;
  inviteCode: string;
  isAdmin: boolean;
};

export const LeaderboardInviteTokenField = ({
  leaderboardName,
  inviteCode,
  isAdmin,
}: LeaderboardInviteTokenFieldProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <TokenField
      value={inviteCode}
      regenerate={
        isAdmin
          ? async () => {
              const result = await regenerateInviteCode(leaderboardName);
              if (result && "error" in result) {
                switch (result.error) {
                  case RegenerateInviteCodeError.RateLimited:
                    router.push("/rate-limited");
                    break;
                  case RegenerateInviteCodeError.Unauthorized:
                    showNotification({
                      title: t("error"),
                      color: "red",
                      message: t("errors.unauthorized"),
                    });
                    await logOutAndRedirect();
                    break;
                  case RegenerateInviteCodeError.UnknownError:
                    showNotification({
                      title: t("error"),
                      color: "red",
                      message: t("unknownErrorOccurred"),
                    });
                    break;
                }
              } else {
                router.refresh();
              }
            }
          : undefined
      }
      censorable
      revealLength={4}
      textFormatter={(currentValue: string) => `ttlic_${currentValue}`}
      copyFormatter={(currentValue: string) => `ttlic_${currentValue}`}
    />
  );
};
