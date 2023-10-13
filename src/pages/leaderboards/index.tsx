import { Button, Group, Modal, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useCallback, useEffect, useState } from "react";
import {
  Leaderboard,
  LeaderboardData,
  useLeaderboards,
} from "../../hooks/useLeaderboards";
import { LeaderboardModal } from "../../components/leaderboard/LeaderboardModal";
import { CreateLeaderboardModal } from "../../components/leaderboard/CreateLeaderboardModal";
import { JoinLeaderboardModal } from "../../components/leaderboard/JoinLeaderboardModal";
import { EnterIcon, PlusIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";
import { LeaderboardsList } from "../../components/leaderboard/LeaderboardsList";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import axios from "../../axios";
import { ApiUsersUserResponse } from "../../hooks/useAuthentication";

export type LeaderboardsPageProps = {
  initialLeaderboards: LeaderboardData[];
  username: string;
};

const LeaderboardsPage = (props: LeaderboardsPageProps) => {
  const {
    leaderboards,
    leaveLeaderboard,
    deleteLeaderboard,
    promoteUser,
    demoteUser,
    kickUser,
    regenerateInviteCode,
  } = useLeaderboards({
    initialLeaderboards: props.initialLeaderboards,
    shouldFetch: false,
  });

  const modals = useModals();
  const [openedLeaderboardName, setOpenedLeaderboardName] = useState<
    string | undefined
  >(undefined);
  const openedLeaderboard = leaderboards.find(
    (l) => l.name === openedLeaderboardName,
  );

  const router = useRouter();
  const urlLeaderboardCode =
    typeof router.query.code === "string" ? router.query.code : null;

  const { t } = useTranslation();

  const openCreateLeaderboard = () => {
    const id = modals.openModal({
      title: t("leaderboards.createNewLeaderboard"),
      size: "xl",
      children: (
        <CreateLeaderboardModal
          onCreate={() => {
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

  const openJoinLeaderboard = useCallback(() => {
    const id = modals.openModal({
      title: t("leaderboards.joinLeaderboard"),
      size: "xl",
      children: (
        <JoinLeaderboardModal
          initialCode={urlLeaderboardCode}
          onJoin={() => {
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
  }, [modals, t, urlLeaderboardCode]);

  useEffect(() => {
    if (urlLeaderboardCode) openJoinLeaderboard();
  }, [openJoinLeaderboard, urlLeaderboardCode]);

  const adminUsernames = openedLeaderboard?.members
    .filter((m) => m.admin)
    .map((m) => m.username);
  const isAdmin = Boolean(adminUsernames?.includes(props.username));

  return (
    <>
      <Modal
        opened={Boolean(openedLeaderboard)}
        onClose={() => {
          setOpenedLeaderboardName(undefined);
        }}
        title={openedLeaderboard?.name}
        withCloseButton
        size="xl"
        styles={{
          title: {
            fontSize: "2rem",
            marginBlock: "0.5rem",
            fontWeight: "bold",
          },
        }}
      >
        {openedLeaderboard && (
          <LeaderboardModal
            leaveLeaderboard={async () => {
              await leaveLeaderboard(openedLeaderboard.name);
              setOpenedLeaderboardName(undefined);
            }}
            leaderboard={openedLeaderboard}
            deleteLeaderboard={async () => {
              await deleteLeaderboard(openedLeaderboard.name);
              setOpenedLeaderboardName(undefined);
            }}
            isAdmin={Boolean(adminUsernames?.includes(props.username))}
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
            regenerateInviteCode={async () =>
              await regenerateInviteCode(openedLeaderboard.name)
            }
            username={props.username}
          />
        )}
      </Modal>
      <Group align="center" mb="md" mt="xl" justify="space-between">
        <Title>{t("leaderboards.leaderboards")}</Title>
        <Group gap="sm">
          <Button
            onClick={() => {
              openCreateLeaderboard();
            }}
            variant="outline"
            leftSection={<PlusIcon />}
          >
            {t("leaderboards.createNewLeaderboard")}
          </Button>
          <Button
            onClick={() => {
              openJoinLeaderboard();
            }}
            leftSection={<EnterIcon />}
          >
            {t("leaderboards.joinLeaderboard")}
          </Button>
        </Group>
      </Group>
      <LeaderboardsList
        setOpenedLeaderboardName={setOpenedLeaderboardName}
        leaderboards={leaderboards}
        username={props.username}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  LeaderboardsPageProps
> = async ({ locale, req }) => {
  const token = req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const leaderboardListResponse = await axios.get<Leaderboard[]>(
    "/users/@me/leaderboards",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  const leaderboardPromises = leaderboardListResponse.data.map(
    async (leaderboard) => {
      const response = await axios.get<LeaderboardData>(
        `/leaderboards/${leaderboard.name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Forwarded-For": req.socket.remoteAddress,
          },
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        },
      );
      return response.data;
    },
  );

  const leaderboards = await Promise.all(leaderboardPromises);

  const meResponse = await axios.get<ApiUsersUserResponse>("/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
      initialLeaderboards: leaderboards,
      username: meResponse.data.username,
    },
  };
};

export default LeaderboardsPage;
