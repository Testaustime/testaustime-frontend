"use client";

import { Button, Table, TableTh, TableThead, TableTr } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { showNotification } from "@mantine/notifications";
import styles from "./FriendList.module.css";
import { useTranslation } from "react-i18next";
import { ApiFriendsResponseItem } from "../../api/friendsApi";
import { removeFriend } from "./actions";
import Link from "next/link";

type FriendListProps = {
  friends: ApiFriendsResponseItem[];
  ownTimeCoded: number;
  username: string;
  locale: string;
};

export const FriendList = ({
  friends,
  ownTimeCoded,
  username,
  locale,
}: FriendListProps) => {
  const { t } = useTranslation();

  const friendsSorted = [
    ...friends
      .map((f) => ({
        isMe: false,
        codingTime: f.coding_time.past_month,
        username: f.username,
      }))
      .concat({
        codingTime: ownTimeCoded,
        isMe: true,
        username,
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
        {friendsSorted.map(({ username, codingTime, isMe }, idx) => (
          <TableTr
            key={username}
            className={isMe ? styles.tableRow : undefined}
          >
            <Table.Td>{idx + 1}</Table.Td>
            <Table.Td>{username}</Table.Td>
            <Table.Td>{prettyDuration(codingTime)}</Table.Td>
            <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
              {!isMe && (
                <Link href={`/${locale}/friends/${username}`}>
                  {t("friends.showDashboard")}
                </Link>
              )}
            </Table.Td>
            <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
              {!isMe && (
                <Button
                  variant="outline"
                  color="red"
                  size="compact-md"
                  onClick={() => {
                    removeFriend(username)
                      .then((result) => {
                        if (result) {
                          showNotification({
                            title: t("error"),
                            color: "red",
                            message: t("friends.errorRemovingFriend"),
                          });
                        }
                      })
                      .catch(() => {
                        showNotification({
                          title: t("error"),
                          color: "red",
                          message: t("friends.errorRemovingFriend"),
                        });
                      });
                  }}
                >
                  {t("friends.unfriend")}
                </Button>
              )}
            </Table.Td>
          </TableTr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
