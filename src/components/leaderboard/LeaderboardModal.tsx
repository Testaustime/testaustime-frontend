"use client";

import { Group, Button, Title, Table, Badge } from "@mantine/core";
import {
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { Trash2 } from "react-feather";
import { useTranslation } from "react-i18next";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { ButtonWithConfirmation } from "../ButtonWithConfirmation/ButtonWithConfirmation";
import { TokenField } from "../TokenField/TokenField";
import { LeaderboardData } from "../../types";

interface LeaderboardModalProps {
  leaveLeaderboard: () => Promise<void>;
  leaderboard: LeaderboardData;
  deleteLeaderboard: () => Promise<void>;
  isAdmin: boolean;
  isLastAdmin: boolean;
  promoteUser: (username: string) => Promise<void>;
  demoteUser: (username: string) => Promise<void>;
  kickUser: (username: string) => Promise<void>;
  regenerateInviteCode: () => Promise<void>;
  username: string;
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
  regenerateInviteCode,
  username,
}: LeaderboardModalProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Group mb="md">
        <ButtonWithConfirmation
          color="red"
          size="xs"
          leftSection={<ExitIcon />}
          onClick={() => {
            leaveLeaderboard().catch((e) => {
              console.log(e);
            });
          }}
          disabled={isLastAdmin}
        >
          {t("leaderboards.leaveLeaderboard")}
        </ButtonWithConfirmation>
        {isAdmin && (
          <ButtonWithConfirmation
            color="red"
            size="xs"
            leftSection={<Trash2 size={18} />}
            onClick={() => {
              deleteLeaderboard().catch((e) => {
                console.log(e);
              });
            }}
          >
            {t("leaderboards.deleteLeaderboard")}
          </ButtonWithConfirmation>
        )}
      </Group>
      <Title order={2} my="md">
        {t("leaderboards.inviteCode")}
      </Title>
      <TokenField
        value={leaderboard.invite}
        regenerate={isAdmin ? regenerateInviteCode : undefined}
        censorable
        revealLength={4}
        textFormatter={(currentValue: string) => `ttlic_${currentValue}`}
        copyFormatter={(currentValue: string) => `ttlic_${currentValue}`}
      />
      <Title order={2} my="md">
        {t("leaderboards.members")}
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("leaderboards.position")}</Table.Th>
            <Table.Th>{t("leaderboards.name")}</Table.Th>
            <Table.Th>{t("leaderboards.timeCoded", { days: 7 })}</Table.Th>
            {isAdmin && (
              <>
                <Table.Th />
                <Table.Th />
              </>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {[...leaderboard.members]
            .sort((a, b) => b.time_coded - a.time_coded)
            .map((member, i) => {
              return (
                <Table.Tr key={member.username}>
                  <Table.Td>
                    {i + 1}
                    {getOrdinalSuffix(i + 1)}
                  </Table.Td>
                  <Table.Td>
                    {member.username}
                    {member.admin && (
                      <Badge ml="sm">{t("leaderboards.admin")}</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>{prettyDuration(member.time_coded)}</Table.Td>
                  {isAdmin && (
                    <>
                      <Table.Td
                        style={{
                          width: 0,
                          padding: 0,
                          textAlign: "right",
                          paddingRight: 10,
                        }}
                      >
                        {member.username !== username && (
                          <>
                            <Button
                              size="xs"
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                kickUser(member.username).catch((e) => {
                                  console.log(e);
                                });
                              }}
                            >
                              {t("leaderboards.kick")}
                            </Button>
                          </>
                        )}
                      </Table.Td>
                      <Table.Td
                        style={{
                          width: 0,
                          padding: 0,
                          textAlign: "right",
                        }}
                      >
                        {member.admin ? (
                          <Button
                            size="xs"
                            variant="subtle"
                            leftSection={<DoubleArrowDownIcon />}
                            color="red"
                            onClick={() => {
                              demoteUser(member.username).catch((e) => {
                                console.log(e);
                              });
                            }}
                          >
                            {t("leaderboards.demote")}
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="subtle"
                            leftSection={<DoubleArrowUpIcon />}
                            color="green"
                            onClick={() => {
                              promoteUser(member.username).catch((e) => {
                                console.log(e);
                              });
                            }}
                          >
                            {t("leaderboards.promote")}
                          </Button>
                        )}
                      </Table.Td>
                    </>
                  )}
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
    </>
  );
};
