"use client";

import { showNotification } from "@mantine/notifications";
import TokenField from "../../../components/TokenField";
import { regenerateToken } from "./actions";
import { useTranslation } from "react-i18next";
import { RegenerateAuthTokenError } from "../../../types";
import { useRouter } from "next/navigation";
import { logOutAndRedirect } from "../../../utils/authUtils";

export const AuthTokenField = ({ token }: { token: string }) => {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <TokenField
      value={token}
      regenerate={async () => {
        const result = await regenerateToken();
        if (result) {
          switch (result.error) {
            case RegenerateAuthTokenError.RateLimited:
              router.push("/rate-limited");
              break;
            case RegenerateAuthTokenError.Unauthorized:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("errors.unauthorized"),
              });
              await logOutAndRedirect();
              break;
            case RegenerateAuthTokenError.UnknownError:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("unknownErrorOccurred"),
              });
              break;
          }
        }
      }}
      censorable
      revealLength={4}
    />
  );
};
