import { Group, Button, Title, Table, Badge } from "@mantine/core";
import { DoubleArrowDownIcon, DoubleArrowUpIcon, ExitIcon } from "@radix-ui/react-icons";
import { Trash2 } from "react-feather";
import { useAuthentication } from "../../hooks/useAuthentication";
import { CombinedLeaderboard } from "../../hooks/useLeaderboards";
import { useI18nContext } from "../../i18n/i18n-react";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { ButtonWithConfirmation } from "../ButtonWithConfirmation/ButtonWithConfirmation";
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

  const { LL } = useI18nContext();

  return <>
    <Group mb="md">
      <ButtonWithConfirmation
        color="red"
        size="xs"
        leftIcon={<ExitIcon />}
        onClick={() => { leaveLeaderboard().catch(e => console.log(e)); }}
        disabled={isLastAdmin}
      >
        {LL.leaderboards.leaveLeaderboard()}
      </ButtonWithConfirmation>
      {isAdmin && <ButtonWithConfirmation
        color="red"
        size="xs"
        leftIcon={<Trash2 size={18} />}
        onClick={() => { deleteLeaderboard().catch(e => console.log(e)); }}>
        {LL.leaderboards.deleteLeaderboard()}
      </ButtonWithConfirmation>}
    </Group>
    <Title order={2} my="md">{LL.leaderboards.inviteCode()}</Title>
    <TokenField
      value={leaderboard.invite}
      regenerate={isAdmin ? regenerateInviteCode : undefined}
      censorable
      revealLength={4}
      textFormatter={(currentValue: string) => `ttlic_${currentValue}`}
      copyFormatter={(currentValue: string) => `ttlic_${currentValue}`}
    />
    <Title order={2} my="md">{LL.leaderboards.members()}</Title>
    <Table>
      <thead>
        <tr>
          <th>{LL.leaderboards.position()}</th>
          <th>{LL.leaderboards.name()}</th>
          <th>{LL.leaderboards.timeCoded({ days: 7 })}</th>
          {isAdmin && <>
            <th />
            <th />
          </>}
        </tr>
      </thead>
      <tbody>
        {[...leaderboard.members].sort((a, b) => b.time_coded - a.time_coded).map((member, i) => {
          return <tr key={member.username}>
            <td>{i + 1}{getOrdinalSuffix(i + 1)}</td>
            <td>{member.username}{member.admin && <Badge ml="sm">{LL.leaderboards.admin()}</Badge>}</td>
            <td>{prettyDuration(member.time_coded)}</td>
            {isAdmin && <>
              <td style={{
                width: 0,
                padding: 0,
                textAlign: "right",
                paddingRight: 10
              }}>
                {member.username !== username && <>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      kickUser(member.username).catch(e => console.log(e));
                    }}
                  >
                    {LL.leaderboards.kick()}
                  </Button>
                </>}
              </td>
              <td style={{
                width: 0,
                padding: 0,
                textAlign: "right"
              }}>
                {(member.admin ?
                  <Button
                    size="xs"
                    variant="subtle"
                    leftIcon={<DoubleArrowDownIcon />}
                    color="red"
                    onClick={() => {
                      demoteUser(member.username).catch(e => console.log(e));
                    }}
                  >
                    {LL.leaderboards.demote()}
                  </Button> :
                  <Button
                    size="xs"
                    variant="subtle"
                    leftIcon={<DoubleArrowUpIcon />}
                    color="green"
                    onClick={() => {
                      promoteUser(member.username).catch(e => console.log(e));
                    }}
                  >
                    {LL.leaderboards.promote()}
                  </Button>)}
              </td>
            </>}
          </tr>;
        })}
      </tbody>
    </Table>
  </>;
};
