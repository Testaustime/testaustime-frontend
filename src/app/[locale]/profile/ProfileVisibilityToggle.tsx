"use client";

import ButtonWithConfirmation from "../../../components/ButtonWithConfirmation";
import { useTranslation } from "react-i18next";
import { changeAccountVisibility } from "./actions";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";

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
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred"),
            });
          }
          router.refresh();
        })();
      }}
    >
      {isPublic
        ? t("profile.accountVisibility.makePrivate")
        : t("profile.accountVisibility.makePublic")}
    </ButtonWithConfirmation>
  );
};
