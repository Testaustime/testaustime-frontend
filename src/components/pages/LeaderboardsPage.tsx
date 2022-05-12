import { Badge, Button, Group, Table, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Form, Formik } from "formik";
import { useState } from "react";
import useAuthentication from "../../hooks/UseAuthentication";
import { CombinedLeaderboard, useLeaderboards } from "../../hooks/useLeaderboards";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import axios from "axios";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";

interface JoinLeaderboardModalProps {
  onJoin: (leaderboardCode: string) => Promise<void>
}

interface LeaderboardModalProps {
  leaveLeaderboard: (leaderboardId: string) => Promise<void>,
  leaderboard: CombinedLeaderboard
}

const LeaderboardModal = ({ leaderboard, leaveLeaderboard }: LeaderboardModalProps) => {
  return <>
    <Button color="red" size="xs" mb="md" onClick={() => {
      leaveLeaderboard(leaderboard.name).catch(e => console.log(e));
    }}>Leave leaderboard</Button>
    <Text>Invite code: <code>ttlic_{leaderboard.invite}</code></Text>
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
  </>;
};

const JoinLeaderboardModal = ({ onJoin }: JoinLeaderboardModalProps) => {
  const [error, setError] = useState<string>("");
  const [placeholderLeaderboardInviteCode] = useState(generateLeaderboardInviteCode());

  return <>
    <Formik
      initialValues={{
        leaderboardCode: ""
      }}
      validationSchema={Yup.object().shape({
        leaderboardCode: Yup
          .string()
          .required("Invite code is required")
          .matches(
            /^ttlic_[a-zA-Z0-9]{32}$/,
            "Friend code must start with \"ttlic_\", and be followed by 24 alphanumeric characters.")
      })}
      onSubmit={values => {
        onJoin(values.leaderboardCode).catch((e: unknown) => {
          console.log(e);
          if (axios.isAxiosError(e)) {
            if (e.response?.status === 409) {
              setError("You are already a member of this leaderboard");
            }
            else {
              setError("Error joining leaderboard");
            }
          }
          else {
            setError("Error joining leaderboard");
          }
        });
      }}
    >
      {() => <Form onChange={() => {
        setError("");
      }}>
        <FormikTextInput
          name="leaderboardCode"
          label="Leaderboard Code"
          placeholder={placeholderLeaderboardInviteCode}
          styles={theme => ({
            invalid: {
              "::placeholder": {
                color: theme.fn.rgba(theme.colors.red[5], 0.4)
              }
            }
          })}
        />
        <Group position="right" mt="md">
          <Button type="submit">Join</Button>
        </Group>
      </Form>}
    </Formik>
    {error && <Text color="red">{error}</Text>}
  </>;
};

interface CreateLeaderboardModalProps {
  onCreate: (leaderboardName: string) => Promise<void>
}

const CreateLeaderboardModal = ({ onCreate }: CreateLeaderboardModalProps) => {
  const [error, setError] = useState<string>("");

  return <>
    <Formik
      initialValues={{
        leaderboardName: ""
      }}
      onSubmit={values => {
        onCreate(values.leaderboardName)
          .catch(e => {
            if (axios.isAxiosError(e)) {
              if (e.response?.status === 409) {
                setError("Leaderboard already exists");
              }
              else {
                setError("Error creating leaderboard");
              }
            }
            else {
              setError("Error creating leaderboard");
            }
          });
      }}
      validationSchema={Yup.object().shape({
        leaderboardName: Yup.string()
          .required()
          .min(2, "Leaderboard name must be at least 2 characters long")
          .max(32, "Leaderboard name must be at most 32 characters long")
          .matches(/^[a-zA-Z0-9]*$/, "Leaderboard name must only contain alphanumeric characters")
      })}
    >
      {() => <Form>
        <FormikTextInput name="leaderboardName" />
        <Group position="right" mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </Form>}
    </Formik>
    {error && <Text color="red">{error}</Text>}
  </>;
};

export const LeaderboardsPage = () => {
  const { leaderboards, joinLeaderboard, leaveLeaderboard, createLeaderboard } = useLeaderboards();
  const { username } = useAuthentication();
  const modals = useModals();

  if (!username) return <Text>No user</Text>;

  const openLeaderboard = (leaderboard: CombinedLeaderboard) => {
    const id = modals.openModal({
      title: <Title>{leaderboard.name}</Title>,
      size: "xl",
      children: <LeaderboardModal
        leaveLeaderboard={async () => {
          await leaveLeaderboard(leaderboard.name);
          modals.closeModal(id);
        }}
        leaderboard={leaderboard}
      />
    });
  };

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
      children: <JoinLeaderboardModal onJoin={async code => {
        await joinLeaderboard(code);
        modals.closeModal(id);
      }} />
    });
  };

  return <>
    <Group align="center" mb="md" mt="xl" position="apart">
      <Title>Leaderboards</Title>
      <Group spacing="sm">
        <Button onClick={() => openCreateLeaderboard()} variant="outline">Create new leaderboard</Button>
        <Button onClick={() => openJoinLeaderboard()}>Join a leaderboard</Button>
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

          return <tr key={leaderboard.invite}>
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