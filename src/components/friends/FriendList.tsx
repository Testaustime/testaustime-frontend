"use client";
import { Table, TableTh, TableThead, TableTr } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ApiFriendsResponseItem } from "../../api/friendsApi";
import { CurrentActivity } from "../CurrentActivity/CurrentActivity";
import { FriendListRow } from "./FriendListRow";
import { TimeUnit } from "../../utils/dateUtils";

type FriendListProps = {
  friends: ApiFriendsResponseItem[];
  ownTimeCoded: number;
  username: string;
  locale: string;
  ownStatus: CurrentActivity | null;
  maxTimeUnit: TimeUnit;
};

export const FriendList = ({
  friends,
  ownTimeCoded,
  username,
  locale,
  ownStatus,
  maxTimeUnit,
}: FriendListProps) => {
  const { t } = useTranslation();

  const friendsSorted = [
    ...friends
      .map((f) => ({
        isMe: false,
        codingTime: f.coding_time.past_month,
        username: f.username,
        status: f.status
          ? {
              projectName: f.status.heartbeat.project_name,
              language: f.status.heartbeat.language,
              startedAt: f.status.started,
            }
          : null,
      }))
      .concat({
        codingTime: ownTimeCoded,
        isMe: true,
        username,
        status: ownStatus,
      }),
  ].sort((a, b) => b.codingTime - a.codingTime);

  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>{t("friends.index")}</TableTh>
          <TableTh>{t("friends.friendName")}</TableTh>
          <TableTh>{t("friends.timeCoded", { days: 30 })}</TableTh>
          <TableTh />
          <TableTh />
        </TableTr>
      </TableThead>
      <Table.Tbody>
        {friendsSorted.map(({ username, codingTime, isMe, status }, idx) => (
          <FriendListRow
            key={username}
            index={idx}
            username={username}
            status={status}
            locale={locale}
            codingTime={codingTime}
            isMe={isMe}
            maxTimeUnit={maxTimeUnit}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
};
