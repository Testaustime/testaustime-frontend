import { Button, Grid, Input, Title, Table } from "@mantine/core";
import { User } from "tabler-icons-react";
import { useEffect, useState, useCallback } from "react";
import { useFriends } from "../hooks/useFriends";
import { useNotifications } from "@mantine/notifications";

export const Friendboard = () => {
  const { addFriend, friends } = useFriends();
  const notifications = useNotifications();

  const [friendCode, setFriendCode]=useState<string>("");

  return <div>
    <Title order={2}>Add new friend</Title>
    <br />
    <Grid columns={24}>
      <Grid.Col span={21}>
        <Input
          icon={<User />}
          placeholder="Friend code"
          value={friendCode} 
          onChange={(e: React.ChangeEvent<any>)=>setFriendCode(e.target.value)}
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
    <br />
    <Title order={2}>Your friends</Title>

    <Table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Friend name</th>
        </tr>
      </thead>
      <tbody>{friends.map((username, idx) => (
        <tr key={username}>
          <td>{idx+1}</td>
          <td>{username}</td>
        </tr>
      ))}</tbody>
    </Table>
  </div>;
};
