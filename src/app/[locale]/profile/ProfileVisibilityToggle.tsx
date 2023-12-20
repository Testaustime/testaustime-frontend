"use client";

import ButtonWithConfirmation from "../../../components/ButtonWithConfirmation";
import { useTranslation } from "react-i18next";
import { changeAccountVisibility } from "./actions";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { ChangeAccountVisibilityError } from "../../../types";
import { logOutAndRedirect } from "../../../utils/authUtils";

export const ProfileVisibilityToggle = ({
  isPublic,
}: {
  isPublic: boolean;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ButtonWithConfirmation
      color="red"
      onClick={() => {
        void (async () => {
          const result = await changeAccountVisibility(!isPublic);
          if (result) {
            switch (result.error) {
              case ChangeAccountVisibilityError.RateLimited:
                router.push("/rate-limited");
                break;
              case ChangeAccountVisibilityError.Unauthorized:
                showNotification({
                  title: t("error"),
                  color: "red",
                  message: t("errors.unauthorized"),
                });
                await logOutAndRedirect();
                break;
              case ChangeAccountVisibilityError.UnknownError:
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
        })();
      }}
    >
      {isPublic
        ? t("profile.accountVisibility.makePrivate")
        : t("profile.accountVisibility.makePublic")}
    </ButtonWithConfirmation>
  );
};
