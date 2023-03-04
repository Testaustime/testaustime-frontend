import { Badge, Button, Table } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useLeaderboards } from "../../hooks/useLeaderboards";
import { useTranslation } from "next-i18next";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";

export interface LeaderboardsListProps {
  setOpenedLeaderboardName: (name: string) => void
}

export const LeaderboardsList = ({
  setOpenedLeaderboardName
}: LeaderboardsListProps) => {
  const { leaderboards } = useLeaderboards();
  const { username } = useAuthentication();

  const { t } = useTranslation();

  return <Table>
    <thead>
      <tr>
        <th>{t("leaderboards.name")}</th>
        <th>{t("leaderboards.topMember")}</th>
        <th>{t("leaderboards.yourPosition")}</th>
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
          <td>{leaderboard.name}{userIsAdmin && <Badge ml="sm">{t("leaderboards.admin")}</Badge>}</td>
          <td>{topMember.username} ({prettyDuration(topMember.time_coded)})</td>
          <td>{yourPosition}{getOrdinalSuffix(yourPosition)} {yourPosition === 1 ? "🏆" : ""}</td>
          <td style={{ display: "flex", justifyContent: "end" }}>
            <Button
              compact
              size="sm"
              variant="outline"
              onClick={() => setOpenedLeaderboardName(leaderboard.name)}
            >
              {t("leaderboards.seeMore")}
            </Button>
          </td>
        </tr>;
      })}
    </tbody>
  </Table>;
};
