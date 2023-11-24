"use client";

import { Badge, Button, Table } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { useModals } from "@mantine/modals";
import { LeaderboardModal } from "./LeaderboardModal";
import axios from "../../axios";
import { LeaderboardData } from "../../types";
import { useTranslation } from "react-i18next";
import { deleteLeaderboard, leaveLeaderboard } from "./actions";

interface LeaderboardsListProps {
  leaderboards: LeaderboardData[];
  username: string;
}

export const LeaderboardsList = ({
  leaderboards,
  username,
}: LeaderboardsListProps) => {
  const modals = useModals();
  const { t } = useTranslation();

  const openLeaderboard = (leaderboardName: string) => {
    const openedLeaderboard = leaderboards.find(
      (l) => l.name === leaderboardName,
    );
    if (openedLeaderboard === undefined) return;

    const adminUsernames = openedLeaderboard.members
      .filter((m) => m.admin)
      .map((m) => m.username);
    const isAdmin = adminUsernames.includes(username);

    const id = modals.openModal({
      title: openedLeaderboard.name,
      withCloseButton: true,
      size: "xl",
      styles: {
        title: {
          fontSize: "2rem",
          marginBlock: "0.5rem",
          fontWeight: "bold",
        },
      },
      children: (
        <LeaderboardModal
          leaveLeaderboard={async () => {
            await leaveLeaderboard(openedLeaderboard.name, username);
            modals.closeModal(id);
          }}
          leaderboard={openedLeaderboard}
          deleteLeaderboard={async () => {
            await deleteLeaderboard(openedLeaderboard.name, username);
            modals.closeModal(id);
          }}
          isAdmin={Boolean(adminUsernames.includes(username))}
          isLastAdmin={isAdmin && adminUsernames.length === 1}
          promoteUser={async (username: string) => {
            await axios.post(
              `/leaderboards/${openedLeaderboard.name}/promote`,
              { user: username },
            );
          }}
          demoteUser={async (username: string) => {
            await axios.post(`/leaderboards/${openedLeaderboard.name}/demote`, {
              user: username,
            });
          }}
          kickUser={async (username: string) => {
            await axios.post(`/leaderboards/${openedLeaderboard.name}/kick`, {
              user: username,
            });
          }}
          regenerateInviteCode={async () => {
            await axios.post<{ invite_code: string }>(
              `/leaderboards/${openedLeaderboard.name}/regenerate`,
              {},
            );
          }}
          username={username}
        />
      ),
    });
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t("leaderboards.name")}</Table.Th>
          <Table.Th>{t("leaderboards.topMember")}</Table.Th>
          <Table.Th>{t("leaderboards.yourPosition")}</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {leaderboards.map((leaderboard) => {
          const membersSorted = [...leaderboard.members].sort(
            (a, b) => b.time_coded - a.time_coded,
          );
          const topMember = membersSorted[0];
          const yourPosition =
            membersSorted.findIndex((member) => member.username === username) +
            1;
          const userIsAdmin = Boolean(
            leaderboard.members.find((member) => member.username === username)
              ?.admin,
          );

          return (
            <Table.Tr key={leaderboard.invite}>
              <Table.Td>
                {leaderboard.name}
                {userIsAdmin && (
                  <Badge ml="sm">{t("leaderboards.admin")}</Badge>
                )}
              </Table.Td>
              <Table.Td>
                {topMember.username} ({prettyDuration(topMember.time_coded)})
              </Table.Td>
              <Table.Td>
                {yourPosition}
                {getOrdinalSuffix(yourPosition)}{" "}
                {yourPosition === 1 ? "🏆" : ""}
              </Table.Td>
              <Table.Td style={{ display: "flex", justifyContent: "end" }}>
                <Button
                  size="compact-sm"
                  variant="outline"
                  onClick={() => {
                    openLeaderboard(leaderboard.name);
                  }}
                >
                  {t("leaderboards.seeMore")}
                </Button>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
