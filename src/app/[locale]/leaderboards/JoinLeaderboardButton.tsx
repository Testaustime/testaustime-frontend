"use client";

import { Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { EnterIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { JoinLeaderboardModal } from "../../../components/leaderboard/JoinLeaderboardModal";
import { useTranslation } from "react-i18next";

export const JoinLeaderboardButton = () => {
  const modals = useModals();
  const params = useSearchParams();
  const urlLeaderboardCode = params.get("code");
  const { t } = useTranslation();
  const router = useRouter();

  const openJoinLeaderboard = useCallback(() => {
    const id = modals.openModal({
      title: t("leaderboards.joinLeaderboard"),
      size: "xl",
      children: (
        <JoinLeaderboardModal
          initialCode={urlLeaderboardCode}
          onJoin={() => {
            router.refresh();
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
  }, [modals, router, t, urlLeaderboardCode]);

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
      {t("leaderboards.joinLeaderboard")}
    </Button>
  );
};
