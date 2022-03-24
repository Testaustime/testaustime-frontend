import { Button, Grid, Input, Title, Table, Group } from "@mantine/core";
import { useState } from "react";
import { useFriends } from "../hooks/useFriends";
import { useNotifications } from "@mantine/notifications";
import { PersonIcon } from "@radix-ui/react-icons";

export const Friendboard = () => {
  const { addFriend, unFriend, friends } = useFriends();
  const notifications = useNotifications();

  const [friendCode, setFriendCode] = useState<string>("");

  return <div>
    <Title order={2}>Add new friend</Title>
    <br />
    <Grid columns={24}>
      <Grid.Col span={21}>
        <Input
          icon={<PersonIcon />}
          placeholder="Friend code"
          value={friendCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFriendCode(e.target.value)}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Button onClick={() => {
          addFriend(friendCode).catch(error => {
            notifications.showNotification({
              title: "Error",
              color: "red",
              message: String(error || "An unknown error occurred")
            });
          });
        }}>Add</Button>
      </Grid.Col>
    </Grid>
    <Title order={2} mt={40}>Your friends</Title>
    <Table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Friend name</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>{friends.map((username, idx) => (
        <tr key={username}>
          <td>{idx + 1}</td>
          <td>{username}</td>
          <td>
            <Group position="right">
              <Button variant="outline" color="red" compact onClick={() => {
                unFriend(username).catch(error => {
                  notifications.showNotification({
                    title: "Error",
                    color: "red",
                    message: String(error || "An unknown error occurred")
                  });
                });
              }}>
                Unfriend
              </Button>
            </Group>
          </td>
        </tr>
      ))}</tbody>
    </Table>
  </div>;
};
