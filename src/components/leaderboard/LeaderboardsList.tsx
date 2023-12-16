"use client";

import { Badge, Table, TableTh, TableThead, TableTr } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { getOrdinalSuffix } from "../../utils/stringUtils";
import { Leaderboard } from "../../types";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface LeaderboardsListProps {
  leaderboards: Leaderboard[];
}

export const LeaderboardsList = ({ leaderboards }: LeaderboardsListProps) => {
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
          const topMember = leaderboard.top_member;
          const yourPosition = leaderboard.my_position;

          return (
            <TableTr key={leaderboard.name}>
              <Table.Td>
                {leaderboard.name}
                {leaderboard.me.admin && (
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
