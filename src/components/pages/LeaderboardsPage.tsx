import { Badge, Button, Table, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import useAuthentication from "../../hooks/UseAuthentication";
import { CombinedLeaderboard, useLeaderboards } from "../../hooks/useLeaderboards";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";

export const LeaderboardsPage = () => {
  const { leaderboards } = useLeaderboards();
  const { username } = useAuthentication();
  const modals = useModals();

  if (!username) return <Text>No user</Text>;

  const openModal = (leaderboard: CombinedLeaderboard) => {
    modals.openModal({
      title: <Title>{leaderboard.name}</Title>,
      size: "xl",
      children: (
        <>
          <Title order={2} mb="md">Members</Title>
          <Table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Time coded</th>
              </tr>
            </thead>
            <tbody>
              {[...leaderboard.members].sort((a, b) => b.time_coded - a.time_coded).map((member, i) =>
                <tr key={member.username}>
                  <td>{i + 1}{getOrdinalSuffix(i + 1)}</td>
                  <td>{member.username}{member.admin && <Badge ml="sm">Admin</Badge>}</td>
                  <td>{prettyDuration(member.time_coded)}</td>
                </tr>)}
            </tbody>
          </Table>
        </>
      )
    });
  };

  return <>
    <Title mb="md">Leaderboards</Title>
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

          return <tr key={leaderboard.name}>
            <td>{leaderboard.name}</td>
            <td>{topMember.username} ({prettyDuration(topMember.time_coded)})</td>
            <td>{yourPosition}{getOrdinalSuffix(yourPosition)} {yourPosition === 1 ? "🏆" : ""}</td>
            <td style={{ display: "flex", justifyContent: "end" }}>
              <Button
                compact
                size="sm"
                variant="outline"
                onClick={() => openModal(leaderboard)}
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