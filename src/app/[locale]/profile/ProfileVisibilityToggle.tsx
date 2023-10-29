"use client";

import { useState } from "react";
import ButtonWithConfirmation from "../../../components/ButtonWithConfirmation";
import axios from "../../../axios";
import { showNotification } from "@mantine/notifications";

export const ProfileVisibilityToggle = ({
  isPublicInitial,
  texts,
}: {
  isPublicInitial: boolean;
  texts: {
    makePrivate: string;
    makePublic: string;
    error: string;
    unknownErrorOccurred: string;
  };
}) => {
  const [isPublic, setIsPublic] = useState(isPublicInitial);

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
              title: texts.error,
              color: "red",
              message: texts.unknownErrorOccurred,
            });
          });
      }}
    >
      {isPublic ? texts.makePrivate : texts.makePublic}
    </ButtonWithConfirmation>
  );
};
