import { Badge, Button, Table } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { LeaderboardData } from "../../hooks/useLeaderboards";
import { useTranslation } from "next-i18next";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";

export interface LeaderboardsListProps {
  setOpenedLeaderboardName: (name: string) => void;
  leaderboards: LeaderboardData[];
}

export const LeaderboardsList = ({
  setOpenedLeaderboardName,
  leaderboards,
}: LeaderboardsListProps) => {
  const { username } = useAuthentication();

  const { t } = useTranslation();

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
                    setOpenedLeaderboardName(leaderboard.name);
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
