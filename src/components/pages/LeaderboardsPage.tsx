import { Badge, Button, Group, Table, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Form, Formik } from "formik";
import useAuthentication from "../../hooks/UseAuthentication";
import { CombinedLeaderboard, useLeaderboards } from "../../hooks/useLeaderboards";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { FormikTextInput } from "../forms/FormikTextInput";

interface JoinLeaderboardModalProps {
  onJoin: (leaderboardCode: string) => void
}

const JoinLeaderboardModal = ({ onJoin }: JoinLeaderboardModalProps) => {
  return <>
    <Formik
      initialValues={{
        leaderboardCode: ""
      }}
      onSubmit={values => {
        onJoin(values.leaderboardCode);
      }}
    >
      {() => <Form>
        <FormikTextInput name="leaderboardCode" label="Leaderboard Code" />
        <Group position="right" mt="md">
          <Button type="submit">Join</Button>
        </Group>
      </Form>}
    </Formik>
  </>;
};

export const LeaderboardsPage = () => {
  const { leaderboards, joinLeaderboard, leaveLeaderboard } = useLeaderboards();
  const { username } = useAuthentication();
  const modals = useModals();

  if (!username) return <Text>No user</Text>;

  const openLeaderboard = (leaderboard: CombinedLeaderboard) => {
    modals.openModal({
      title: <Title>{leaderboard.name}</Title>,
      size: "xl",
      children: (
        <>
          <Button color="red" size="xs" onClick={() => leaveLeaderboard(leaderboard.name)}>Leave leaderboard</Button>
          <Text>Invite code: {leaderboard.invite}</Text>
          <Title order={2} my="md">Members</Title>
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

  const openJoinLeaderboard = () => {
    const id = modals.openModal({
      title: <Title>Join a leaderboard</Title>,
      size: "xl",
      children: <JoinLeaderboardModal onJoin={code => {
        joinLeaderboard(code);
        modals.closeModal(id);
      }} />
    });
  };

  return <>
    <Group align="center" mb="md" mt="xl" position="apart">
      <Title>Leaderboards</Title>
      <Button onClick={() => openJoinLeaderboard()}>Join a leaderboard</Button>
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

          return <tr key={leaderboard.name}>
            <td>{leaderboard.name}</td>
            <td>{topMember.username} ({prettyDuration(topMember.time_coded)})</td>
            <td>{yourPosition}{getOrdinalSuffix(yourPosition)} {yourPosition === 1 ? "🏆" : ""}</td>
            <td style={{ display: "flex", justifyContent: "end" }}>
              <Button
                compact
                size="sm"
                variant="outline"
                onClick={() => openLeaderboard(leaderboard)}
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