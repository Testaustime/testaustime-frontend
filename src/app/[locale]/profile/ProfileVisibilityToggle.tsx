"use client";

import { useState } from "react";
import ButtonWithConfirmation from "../../../components/ButtonWithConfirmation";
import axios from "../../../axios";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

export const ProfileVisibilityToggle = ({
  isPublicInitial,
}: {
  isPublicInitial: boolean;
}) => {
  const [isPublic, setIsPublic] = useState(isPublicInitial);
  const { t } = useTranslation();

  const changeAccountVisibility = async (visibility: boolean) => {
    await axios.post("/account/settings", {
      public_profile: visibility,
    });

    setIsPublic(!isPublic);
  };

  return (
    <ButtonWithConfirmation
      color="red"
      onClick={() => {
        changeAccountVisibility(!isPublic)
          .then(() => {
            setIsPublic(!isPublic);
          })
          .catch(() => {
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred"),
            });
          });
      }}
    >
      {isPublic
        ? t("profile.accountVisibility.makePrivate")
        : t("profile.accountVisibility.makePublic")}
    </ButtonWithConfirmation>
  );
};
