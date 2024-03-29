"use client";

import { useModals } from "@mantine/modals";
import { CreateLeaderboardModal } from "../../../components/leaderboard/CreateLeaderboardModal";
import { Button } from "@mantine/core";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export const CreateNewLeaderboardButton = () => {
  const { t } = useTranslation();
  const modals = useModals();
  const router = useRouter();

  const openCreateLeaderboard = () => {
    const id = modals.openModal({
      title: t("leaderboards.createNewLeaderboard"),
      size: "xl",
      children: (
        <CreateLeaderboardModal
          onCreate={() => {
            modals.closeModal(id);
            router.refresh();
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
    <Button
      onClick={() => {
        openCreateLeaderboard();
      }}
      variant="outline"
      leftSection={<PlusIcon />}
    >
      {t("leaderboards.createNewLeaderboard")}
    </Button>
  );
};
