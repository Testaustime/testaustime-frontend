"use client";

import { useRouter } from "next/navigation";
import TokenField from "../../../components/TokenField";
import { regenerateFriendCode } from "./actions";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { logOutAndRedirect } from "../../../utils/authUtils";
import { PostRequestError } from "../../../types";

export const FriendCodeField = ({ friendCode }: { friendCode: string }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <TokenField
      value={friendCode}
      censorable
      revealLength={4}
      regenerate={async () => {
        const result = await regenerateFriendCode();
        if ("error" in result) {
          switch (result.error) {
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
          router.refresh();
        }
      }}
      copyFormatter={(value) => `ttfc_${value}`}
      textFormatter={(value) => `ttfc_${value}`}
    />
  );
};
