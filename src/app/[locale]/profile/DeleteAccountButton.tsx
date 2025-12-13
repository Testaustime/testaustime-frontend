"use client";

import { useModals } from "@mantine/modals";
import ButtonWithConfirmation from "../../../components/ButtonWithConfirmation";
import ConfirmAccountDeletionModal from "../../../components/ConfirmAccountDeletionModal";
import { useTranslation } from "react-i18next";

export const DeleteAccountButton = ({ username }: { username: string }) => {
  const modals = useModals();
  const { t } = useTranslation();

  const openDeleteAccountModal = () => {
    const id = modals.openModal({
      title: t("profile.sudoOperation.confirmButton"),
      size: "xl",
      children: (
        <ConfirmAccountDeletionModal
          username={username}
          closeModal={() => {
            modals.closeModal(id);
          }}
        />
      ),
      styles: {
        title: {
          fontSize: "2rem",
          marginBlock: "0.5rem",
          fontWeight: "bold",
        },
      },
    });
  };

  return (
    <ButtonWithConfirmation
      color="red"
      onClick={() => {
        openDeleteAccountModal();
      }}
    >
      {t("profile.deleteAccount.button")}
    </ButtonWithConfirmation>
  );
};
