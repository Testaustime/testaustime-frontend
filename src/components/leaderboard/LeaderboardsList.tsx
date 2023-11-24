"use client";

import { Badge, Table, TableTh, TableThead, TableTr } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { LeaderboardData } from "../../types";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface LeaderboardsListProps {
  leaderboards: LeaderboardData[];
  username: string;
}

export const LeaderboardsList = ({
  leaderboards,
  username,
}: LeaderboardsListProps) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>{t("leaderboards.name")}</TableTh>
          <TableTh>{t("leaderboards.topMember")}</TableTh>
          <TableTh>{t("leaderboards.yourPosition")}</TableTh>
          <TableTh />
        </TableTr>
      </TableThead>
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
            <TableTr key={leaderboard.invite}>
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
                <Link href={`/leaderboards/${leaderboard.name}`}>
                  {t("leaderboards.seeMore")}
                </Link>
              </Table.Td>
            </TableTr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
