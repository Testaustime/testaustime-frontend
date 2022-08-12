import { Badge, Button, Group, Modal, Table, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/UseAuthentication";
import { useLeaderboards } from "../../hooks/useLeaderboards";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { LeaderboardModal } from "../Leaderboard/LeaderboardModal";
import { CreateLeaderboardModal } from "../Leaderboard/CreateLeaderboardModal";
import { JoinLeaderboardModal } from "../Leaderboard/JoinLeaderboardModal";
import { EnterIcon, PlusIcon } from "@radix-ui/react-icons";
import { useLocation } from "react-router";

export const LeaderboardsPage = () => {
  const {
    leaderboards,
    joinLeaderboard,
    leaveLeaderboard,
    createLeaderboard,
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

  const openCreateLeaderboard = () => {
    const id = modals.openModal({
      title: <Title>Create new leaderboard</Title>,
      size: "xl",
      children: <CreateLeaderboardModal
        onCreate={async (leaderboardName: string) => {
          await createLeaderboard(leaderboardName);
          modals.closeModal(id);
        }}
      />
    });
  };

  const openJoinLeaderboard = () => {
    const id = modals.openModal({
      title: <Title>Join a leaderboard</Title>,
      size: "xl",
      children: <JoinLeaderboardModal initialCode={urlLeaderboardCode} onJoin={async code => {
        await joinLeaderboard(code);
        modals.closeModal(id);
      }} />
    });
  };

  useEffect(() => {
    if (urlLeaderboardCode) openJoinLeaderboard();
  }, [urlLeaderboardCode]);

  if (!username) return <Text>No user</Text>;

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
      <Title>Leaderboards</Title>
      <Group spacing="sm">
        <Button
          onClick={() => openCreateLeaderboard()}
          variant="outline"
          leftIcon={<PlusIcon />}
        >
          Create new leaderboard
        </Button>
        <Button
          onClick={() => openJoinLeaderboard()}
          leftIcon={<EnterIcon />}
        >
          Join a leaderboard
        </Button>
      </Group>
    </Group>
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Top member</th>
          <th>Your position</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {leaderboards.map(leaderboard => {
          if (!leaderboard || !leaderboard.members) return null;
          const membersSorted = [...leaderboard.members].sort((a, b) => b.time_coded - a.time_coded);
          const topMember = membersSorted[0];
          const yourPosition = membersSorted.findIndex(member => member.username === username) + 1;
          const userIsAdmin = Boolean(leaderboard.members.find(member => member.username === username)?.admin);

          return <tr key={leaderboard.invite}>
            <td>{leaderboard.name}{userIsAdmin && <Badge ml="sm">Admin</Badge>}</td>
            <td>{topMember.username} ({prettyDuration(topMember.time_coded)})</td>
            <td>{yourPosition}{getOrdinalSuffix(yourPosition)} {yourPosition === 1 ? "🏆" : ""}</td>
            <td style={{ display: "flex", justifyContent: "end" }}>
              <Button
                compact
                size="sm"
                variant="outline"
                onClick={() => setOpenedLeaderboardName(leaderboard.name)}
              >
                See more
              </Button>
            </td>
          </tr>;
        })}
      </tbody>
    </Table>
  </>;
};
