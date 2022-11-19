import { Button, Table, Text, useMantineTheme } from "@mantine/core";
import { addDays, startOfDay } from "date-fns";
import { useActivityData } from "../../hooks/useActivityData";
import useAuthentication from "../../hooks/UseAuthentication";
import { useFriends } from "../../hooks/useFriends";
import { useI18nContext } from "../../i18n/i18n-react";
import { sumBy } from "../../utils/arrayUtils";
import { prettyDuration } from "../../utils/dateUtils";
import { handleErrorWithNotification } from "../../utils/notificationErrorHandler";

export const FriendList = () => {
  const { unFriend, friends } = useFriends();
  const entries = useActivityData({ dayFilter: "month" });
  const entriesInRange = entries.filter(entry => {
    const startOfStatisticsRange = startOfDay(addDays(new Date(), -30));
    return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
  });
  const { LL } = useI18nContext();
  const { username } = useAuthentication();
  const theme = useMantineTheme();

  if (!username) {
    return <Text>{LL.friends.notLoggedIn()}</Text>;
  }

  const friendsSorted = [...friends.map(f => ({ ...f, isMe: false })).concat({
    coding_time: {
      all_time: 0,
      past_month: sumBy(entriesInRange, entry => entry.duration),
      past_week: 0
    },
    isMe: true,
    username
  })].sort((a, b) => b.coding_time.past_month - a.coding_time.past_month);

  return <Table>
    <thead>
      <tr>
        <th>{LL.friends.index()}</th>
        <th>{LL.friends.friendName()}</th>
        <th>{LL.friends.timeCoded({ days: 30 })}</th>
        <th />
      </tr>
    </thead>
    <tbody>{friendsSorted.map(({ username, coding_time: { past_month }, isMe }, idx) => (
      <tr key={username} style={{
        backgroundColor: isMe ? (theme.colorScheme === "dark" ? "#2b2b2b" : "#dedede") : undefined
      }}>
        <td>{idx + 1}</td>
        <td>{username}</td>
        <td>{prettyDuration(past_month)}</td>
        <td style={{ textAlign: "right" }}>
          {!isMe && <Button
            variant="outline"
            color="red"
            compact
            onClick={() => {
              unFriend(username).catch(handleErrorWithNotification);
            }}
          >
            {LL.friends.unfriend()}
          </Button>}
        </td>
      </tr>
    ))}</tbody>
  </Table>;
};
