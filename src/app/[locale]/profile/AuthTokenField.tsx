"use client";

import { showNotification } from "@mantine/notifications";
import TokenField from "../../../components/TokenField";
import { regenerateToken } from "./actions";
import { useTranslation } from "react-i18next";

export const AuthTokenField = ({ token }: { token: string }) => {
  const { t } = useTranslation();

  return (
    <TokenField
      value={token}
      regenerate={async () => {
        const result = await regenerateToken();
        if (result && "error" in result) {
          showNotification({
            title: t("error"),
            message: result.error,
            color: "red",
          });
        }
      }}
      censorable
      revealLength={4}
    />
  );
};
