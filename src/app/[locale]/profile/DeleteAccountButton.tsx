"use client";

import { useModals } from "@mantine/modals";
import ButtonWithConfirmation from "../../../components/ButtonWithConfirmation";
import { useRouter } from "next/navigation";
import axios from "../../../axios";
import ConfirmAccountDeletionModal from "../../../components/ConfirmAccountDeletionModal";
import { logOut } from "../../../utils/authUtils";
import { useTranslation } from "react-i18next";

export const DeleteAccountButton = ({ username }: { username: string }) => {
  const modals = useModals();
  const router = useRouter();
  const { t } = useTranslation();

  const deleteAccount = async (password: string) => {
    await axios.delete("/users/@me/delete", {
      data: {
        username,
        password,
      },
    });
    await logOut();

    router.push("/");
  };

  const openDeleteAccountModal = () => {
    const id = modals.openModal({
      title: t("profile.deleteAccount.modal.title"),
      size: "xl",
      children: (
        <ConfirmAccountDeletionModal
          onCancel={() => {
            modals.closeModal(id);
          }}
          onConfirm={async (password) => {
            await deleteAccount(password);
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
