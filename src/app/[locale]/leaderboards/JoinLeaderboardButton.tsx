"use client";

import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { EnterIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { JoinLeaderboardModal } from "../../../components/leaderboard/JoinLeaderboardModal";

export const JoinLeaderboardButton = ({
  texts,
  username,
}: {
  texts: {
    title: string;
    button: string;
  };
  username: string;
}) => {
  const modals = useModals();
  const params = useSearchParams();
  const urlLeaderboardCode = params.get("code");

  const openJoinLeaderboard = useCallback(() => {
    const id = modals.openModal({
      title: texts.title,
      size: "xl",
      children: (
        <JoinLeaderboardModal
          initialCode={urlLeaderboardCode}
          onJoin={() => {
            modals.closeModal(id);
          }}
          username={username}
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
  }, [modals, texts.title, urlLeaderboardCode, username]);

  useEffect(() => {
    if (urlLeaderboardCode) openJoinLeaderboard();
  }, [openJoinLeaderboard, urlLeaderboardCode]);

  return (
    <Button
      onClick={() => {
        openJoinLeaderboard();
      }}
      leftSection={<EnterIcon />}
    >
      {texts.button}
    </Button>
  );
};
