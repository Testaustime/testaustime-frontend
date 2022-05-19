import { Group, Button, Title, Table, Badge } from "@mantine/core";
import { ExitIcon } from "@radix-ui/react-icons";
import { Trash2 } from "react-feather";
import useAuthentication from "../../hooks/UseAuthentication";
import { CombinedLeaderboard } from "../../hooks/useLeaderboards";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { ButtonWithConfirmation } from "../ButtonWithConfirmation";
import { TokenField } from "../TokenField/TokenField";

interface LeaderboardModalProps {
  leaveLeaderboard: () => Promise<void>,
  leaderboard: CombinedLeaderboard,
  deleteLeaderboard: () => Promise<void>,
  isAdmin: boolean,
  isLastAdmin: boolean,
  promoteUser: (username: string) => Promise<void>,
  demoteUser: (username: string) => Promise<void>,
  kickUser: (username: string) => Promise<void>,
  regenerateInviteCode: () => Promise<string>
}

export const LeaderboardModal = ({
  leaderboard,
  leaveLeaderboard,
  deleteLeaderboard,
  isAdmin,
  isLastAdmin,
  promoteUser,
  demoteUser,
  kickUser,
  regenerateInviteCode
}: LeaderboardModalProps) => {
  const { username } = useAuthentication();

  return <>
    <Group mb="md">
      <ButtonWithConfirmation
        color="red"
        size="xs"
        leftIcon={<ExitIcon />}
        onClick={() => { leaveLeaderboard().catch(e => console.log(e)); }}
        disabled={isLastAdmin}
      >
        Leave leaderboard
      </ButtonWithConfirmation>
      {isAdmin && <ButtonWithConfirmation
        color="red"
        size="xs"
        leftIcon={<Trash2 size={18} />}
        onClick={() => { deleteLeaderboard().catch(e => console.log(e)); }}>
        Delete leaderboard
      </ButtonWithConfirmation>}
    </Group>
    <Title order={2} my="md">Invite code</Title>
    <TokenField
      value={leaderboard.invite}
      regenerate={isAdmin ? regenerateInviteCode : undefined}
      censorable
      revealLength={4}
      textFormatter={(currentValue: string) => `ttlic_${currentValue}`}
      copyFormatter={(currentValue: string) => `ttlic_${currentValue}`}
    />
    <Title order={2} my="md">Members</Title>
    <Table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Name</th>
          <th>Time coded</th>
          {isAdmin && <th />}
        </tr>
      </thead>
      <tbody>
        {[...leaderboard.members].sort((a, b) => b.time_coded - a.time_coded).map((member, i) => {
          return <tr key={member.username}>
            <td>{i + 1}{getOrdinalSuffix(i + 1)}</td>
            <td>{member.username}{member.admin && <Badge ml="sm">Admin</Badge>}</td>
            <td>{prettyDuration(member.time_coded)}</td>
            {isAdmin && <td>
              <Group position="right" spacing="xs">
                {member.username !== username && <>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      kickUser(member.username).catch(e => console.log(e));
                    }}
                  >
                    Kick
                  </Button>
                  {(member.admin ?
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        demoteUser(member.username).catch(e => console.log(e));
                      }}
                    >
                      Demote
                    </Button> :
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        promoteUser(member.username).catch(e => console.log(e));
                      }}
                    >
                      Promote
                    </Button>)}
                </>}
              </Group>
            </td>}
          </tr>;
        })}
      </tbody>
    </Table>
  </>;
};
