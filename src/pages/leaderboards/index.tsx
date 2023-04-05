import { Button, Group, Modal, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Leaderboard, LeaderboardData, useLeaderboards } from "../../hooks/useLeaderboards";
import { LeaderboardModal } from "../../components/leaderboard/LeaderboardModal";
import { CreateLeaderboardModal } from "../../components/leaderboard/CreateLeaderboardModal";
import { JoinLeaderboardModal } from "../../components/leaderboard/JoinLeaderboardModal";
import { EnterIcon, PlusIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";
import { LeaderboardsList } from "../../components/leaderboard/LeaderboardsList";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import axios from "axios";

export type LeaderboardsPageProps = {
  initialLeaderboards: LeaderboardData[]
}

const LeaderboardsPage = (props: LeaderboardsPageProps) => {
  const {
    leaderboards,
    leaveLeaderboard,
    deleteLeaderboard,
    promoteUser,
    demoteUser,
    kickUser,
    regenerateInviteCode
  } = useLeaderboards({
    initialLeaderboards: props.initialLeaderboards,
    shouldFetch: false
  });

  const { username } = useAuthentication();
  const modals = useModals();
  const [openedLeaderboardName, setOpenedLeaderboardName] = useState<string | undefined>(undefined);
  const openedLeaderboard = leaderboards?.find(l => l.name === openedLeaderboardName);

  const router = useRouter();
  const urlLeaderboardCode = typeof router.query.code === "string" ? router.query.code : null;

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
    <LeaderboardsList
      setOpenedLeaderboardName={setOpenedLeaderboardName}
      leaderboards={leaderboards}
    />
  </>;
};

export const getServerSideProps: GetServerSideProps<LeaderboardsPageProps> = async ({ locale, req }) => {
  const token = req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  const leaderboardListResponse = await axios.get<Leaderboard[]>(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/users/@me/leaderboards`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress
      }
    });

  const leaderboardPromises = leaderboardListResponse.data.map(async leaderboard => {
    const response = await axios.get<LeaderboardData>(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/leaderboards/${leaderboard.name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Forwarded-For": req.socket.remoteAddress
        }
      });
    return response.data;
  });

  const leaderboards = await Promise.all(leaderboardPromises);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
      initialLeaderboards: leaderboards
    }
  };
};

export default LeaderboardsPage;
