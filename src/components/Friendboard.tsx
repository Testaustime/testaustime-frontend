import { Button, Grid, Input, Title, Table } from "@mantine/core";
import { User } from "tabler-icons-react";
import { useEffect, useState, useCallback } from "react";
import { useFriends } from "../hooks/useFriends";

export const Friendboard = () => {
  const { listFriends, addFriend, friends } = useFriends();

  const [friendCode, setFriendCode]=useState<string>("");

  listFriends();

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
          addFriend(friendCode);
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
