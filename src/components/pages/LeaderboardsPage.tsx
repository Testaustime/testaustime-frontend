import { Button, Group, Modal, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useLeaderboards } from "../../hooks/useLeaderboards";
import { LeaderboardModal } from "../leaderboard/LeaderboardModal";
import { CreateLeaderboardModal } from "../leaderboard/CreateLeaderboardModal";
import { JoinLeaderboardModal } from "../leaderboard/JoinLeaderboardModal";
import { EnterIcon, PlusIcon } from "@radix-ui/react-icons";
import { useLocation } from "react-router";
import { useTranslation } from "next-i18next";
import { LeaderboardsList } from "../leaderboard/LeaderboardsList";

export const LeaderboardsPage = () => {
  const {
    leaderboards,
    leaveLeaderboard,
    deleteLeaderboard,
    promoteUser,
    demoteUser,
    kickUser,
    regenerateInviteCode
  } = useLeaderboards();
  const { username } = useAuthentication();
  const modals = useModals();
  const [openedLeaderboardName, setOpenedLeaderboardName] = useState<string | undefined>(undefined);
  const openedLeaderboard = leaderboards.find(l => l.name === openedLeaderboardName);

  const location = useLocation();
  const urlLeaderboardCode = new URLSearchParams(location.search).get("code");

  const { t } = useTranslation();

  const openCreateLeaderboard = () => {
    const id = modals.openModal({
      title: <Title>{t("leaderboards.createNewLeaderboard")}</Title>,
      size: "xl",
      children: <CreateLeaderboardModal
        onCreate={() => { modals.closeModal(id); }}
      />
    });
  };

  const openJoinLeaderboard = () => {
    const id = modals.openModal({
      title: <Title>{t("leaderboards.joinLeaderboard")}</Title>,
      size: "xl",
      children: <JoinLeaderboardModal initialCode={urlLeaderboardCode} onJoin={() => { modals.closeModal(id); }} />
    });
  };

  useEffect(() => {
    if (urlLeaderboardCode) openJoinLeaderboard();
  }, [urlLeaderboardCode]);

  if (!username) return <Text>{t("leaderboards.notLoggedIn")}</Text>;

  const adminUsernames = openedLeaderboard?.members.filter(m => m.admin).map(m => m.username);
  const isAdmin = Boolean(adminUsernames?.includes(username));

  return <>
    <Modal
      opened={Boolean(openedLeaderboard)}
      onClose={() => setOpenedLeaderboardName(undefined)}
      title={<Title>{openedLeaderboard?.name}</Title>}
      withCloseButton
      size="xl"
    >
      {openedLeaderboard && <LeaderboardModal
        leaveLeaderboard={async () => {
          await leaveLeaderboard(openedLeaderboard.name);
          setOpenedLeaderboardName(undefined);
        }}
        leaderboard={openedLeaderboard}
        deleteLeaderboard={async () => {
          await deleteLeaderboard(openedLeaderboard.name);
          setOpenedLeaderboardName(undefined);
        }}
        isAdmin={Boolean(adminUsernames?.includes(username))}
        isLastAdmin={isAdmin && adminUsernames?.length === 1}
        promoteUser={async (username: string) => {
          await promoteUser(openedLeaderboard.name, username);
        }}
        demoteUser={async (username: string) => {
          await demoteUser(openedLeaderboard.name, username);
        }}
        kickUser={async (username: string) => {
          await kickUser(openedLeaderboard.name, username);
        }}
        regenerateInviteCode={async () => await regenerateInviteCode(openedLeaderboard.name)}
      />}
    </Modal>
    <Group align="center" mb="md" mt="xl" position="apart">
      <Title>{t("leaderboards.leaderboards")}</Title>
      <Group spacing="sm">
        <Button
          onClick={() => openCreateLeaderboard()}
          variant="outline"
          leftIcon={<PlusIcon />}
        >
          {t("leaderboards.createNewLeaderboard")}
        </Button>
        <Button
          onClick={() => openJoinLeaderboard()}
          leftIcon={<EnterIcon />}
        >
          {t("leaderboards.joinLeaderboard")}
        </Button>
      </Group>
    </Group>
    <LeaderboardsList setOpenedLeaderboardName={setOpenedLeaderboardName} />
  </>;
};
