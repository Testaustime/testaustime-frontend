"use client";

import { Button, Table } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { useModals } from "@mantine/modals";
import { Dashboard } from "../Dashboard";
import { showNotification } from "@mantine/notifications";
import styles from "./FriendList.module.css";
import axios from "../../axios";
import { useRouter } from "next/navigation";

export interface ApiFriendsResponseItem {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
}

export type FriendListProps = {
  friends: ApiFriendsResponseItem[];
  ownTimeCoded?: number;
  username: string;
  locale: string;
  texts: {
    index: string;
    friendName: string;
    timeCoded: string;
    showDashboard: string;
    unfriend: string;
    friendDashboardTitle: string;
    error: string;
    errorRemovingFriend: string;
    dashboard: {
      installPrompt: string;
      greeting: string;
      statisticsTitle: string;
      projectsLabel: string;
      noProjectsPlaceholder: string;
      projectsFilterPlaceholder: string;
      timeFilters: {
        week: string;
        month: string;
        all: string;
      };
      timePerDay: string;
      noDataTitle: string;
      timePerProject: string;
      languagesTitle: string;
      projectsTitle: string;
      totalTime: string;
      editProjectTitle: string;
      unknownProject: string;
    };
  };
};

export const FriendList = ({
  friends,
  ownTimeCoded,
  username,
  locale,
  texts,
}: FriendListProps) => {
  const modals = useModals();
  const router = useRouter();

  const unFriend = async (username: string) => {
    await axios.delete("/friends/remove", {
      data: username,
      headers: { "Content-Type": "text/plain" },
    });
    return username;
  };

  const friendsSorted = [
    ...friends
      .map((f) => ({ ...f, isMe: false }))
      .concat({
        coding_time: {
          all_time: 0,
          past_month: ownTimeCoded ?? 0,
          past_week: 0,
        },
        isMe: true,
        username,
      }),
  ].sort((a, b) => b.coding_time.past_month - a.coding_time.past_month);

  const openFriendDashboard = (friendUsername: string) => {
    modals.openModal({
      title: texts.friendDashboardTitle.replace(
        // TODO: Get rid of this replacement
        "{{USERNAME_REPLACE_ME}}",
        friendUsername,
      ),
      size: "calc(800px + 10%)",
      children: (
        <Dashboard
          username={friendUsername}
          isFrontPage={false}
          locale={locale}
          texts={texts.dashboard}
        />
      ),
      styles: {
        title: {
          fontSize: "2rem",
          marginBlock: "0.5rem",
          fontWeight: "bold",
        },
      },
    });
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{texts.index}</Table.Th>
          <Table.Th>{texts.friendName}</Table.Th>
          <Table.Th>{texts.timeCoded}</Table.Th>
          <Table.Th />
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {friendsSorted.map(
          ({ username, coding_time: { past_month }, isMe }, idx) => (
            <Table.Tr
              key={username}
              className={isMe ? styles.tableRow : undefined}
            >
              <Table.Td>{idx + 1}</Table.Td>
              <Table.Td>{username}</Table.Td>
              <Table.Td>{prettyDuration(past_month)}</Table.Td>
              <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
                {!isMe && (
                  <Button
                    variant="filled"
                    color="blue"
                    size="compact-md"
                    onClick={() => {
                      openFriendDashboard(username);
                    }}
                  >
                    {texts.showDashboard}
                  </Button>
                )}
              </Table.Td>
              <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
                {!isMe && (
                  <Button
                    variant="outline"
                    color="red"
                    size="compact-md"
                    onClick={() => {
                      unFriend(username)
                        .then(() => {
                          router.refresh();
                        })
                        .catch(() => {
                          showNotification({
                            title: texts.error,
                            color: "red",
                            message: texts.errorRemovingFriend,
                          });
                        });
                    }}
                  >
                    {texts.unfriend}
                  </Button>
                )}
              </Table.Td>
            </Table.Tr>
          ),
        )}
      </Table.Tbody>
    </Table>
  );
};
