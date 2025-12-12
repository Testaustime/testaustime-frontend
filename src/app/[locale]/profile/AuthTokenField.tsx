"use client";

import { showNotification } from "@mantine/notifications";
import TokenField from "../../../components/TokenField";
import { regenerateToken } from "./actions";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { logOutAndRedirect } from "../../../utils/authUtils";
import { PostRequestError } from "../../../types";

export const AuthTokenField = ({ token }: { token: string }) => {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <TokenField
      value={token}
      regenerate={async () => {
        const result = await regenerateToken();
        if (result && "error" in result) {
          switch (result.error) {
            case PostRequestError.RateLimited:
              router.push("/rate-limited");
              break;
            case PostRequestError.Unauthorized:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("errors.unauthorized"),
              });
              await logOutAndRedirect();
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
      }}
      censorable
      revealLength={4}
    />
  );
};
