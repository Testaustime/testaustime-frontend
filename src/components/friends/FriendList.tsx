"use client";
import {
  Button,
  HoverCard,
  Table,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { showNotification } from "@mantine/notifications";
import styles from "./FriendList.module.css";
import { useTranslation } from "react-i18next";
import { ApiFriendsResponseItem } from "../../api/friendsApi";
import { removeFriend } from "./actions";
import Link from "next/link";
import { BlinkingDot } from "../CurrentActivity/BlinkingDot";
import { CurrentActivity } from "../CurrentActivity/CurrentActivity";
import { CurrentActivityDisplay } from "../CurrentActivity/CurrentActivityDisplay";

type FriendListProps = {
  friends: ApiFriendsResponseItem[];
  ownTimeCoded: number;
  username: string;
  locale: string;
  ownStatus: CurrentActivity | null;
};

export const FriendList = ({
  friends,
  ownTimeCoded,
  username,
  locale,
  ownStatus,
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
          <TableTr
            key={username}
            className={isMe ? styles.tableRow : undefined}
          >
            <Table.Td>{idx + 1}</Table.Td>
            <Table.Td>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {username}
                {status && (
                  <HoverCard>
                    <HoverCard.Target>
                      <BlinkingDot />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <CurrentActivityDisplay currentActivity={status} />
                    </HoverCard.Dropdown>
                  </HoverCard>
                )}
              </div>
            </Table.Td>
            <Table.Td>{prettyDuration(codingTime)}</Table.Td>
            <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
              {!isMe && (
                <Link href={`/${locale}/friends/${username}`} prefetch={false}>
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
