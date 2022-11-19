import { Badge, Button, Table } from "@mantine/core";
import useAuthentication from "../../hooks/UseAuthentication";
import { useLeaderboards } from "../../hooks/useLeaderboards";
import { useI18nContext } from "../../i18n/i18n-react";
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

  const { LL } = useI18nContext();

  return <Table>
    <thead>
      <tr>
        <th>{LL.leaderboards.name()}</th>
        <th>{LL.leaderboards.topMember()}</th>
        <th>{LL.leaderboards.yourPosition()}</th>
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
          <td>{leaderboard.name}{userIsAdmin && <Badge ml="sm">{LL.leaderboards.admin()}</Badge>}</td>
          <td>{topMember.username} ({prettyDuration(topMember.time_coded)})</td>
          <td>{yourPosition}{getOrdinalSuffix(yourPosition)} {yourPosition === 1 ? "🏆" : ""}</td>
          <td style={{ display: "flex", justifyContent: "end" }}>
            <Button
              compact
              size="sm"
              variant="outline"
              onClick={() => setOpenedLeaderboardName(leaderboard.name)}
            >
              {LL.leaderboards.seeMore()}
            </Button>
          </td>
        </tr>;
      })}
    </tbody>
  </Table>;
};
