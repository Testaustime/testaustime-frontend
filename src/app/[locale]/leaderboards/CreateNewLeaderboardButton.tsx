"use client";

import { useModals } from "@mantine/modals";
import { CreateLeaderboardModal } from "../../../components/leaderboard/CreateLeaderboardModal";
import { Button } from "@mantine/core";
import { PlusIcon } from "@radix-ui/react-icons";

export const CreateNewLeaderboardButton = ({
  texts,
}: {
  texts: {
    createNewLeaderboardTitle: string;
    button: string;
    modal: {
      error: string;
      leaderboardExists: string;
      leaderboardCreateError: string;
      validation: {
        required: string;
        min: string;
        max: string;
        regex: string;
      };
      create: string;
    };
  };
}) => {
  const modals = useModals();

  const openCreateLeaderboard = () => {
    const id = modals.openModal({
      title: texts.createNewLeaderboardTitle,
      size: "xl",
      children: (
        <CreateLeaderboardModal
          onCreate={() => {
            modals.closeModal(id);
          }}
          texts={texts.modal}
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
      {texts.button}
    </Button>
  );
};
