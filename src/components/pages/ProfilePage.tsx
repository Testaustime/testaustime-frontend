import { Button, Group, Popover, Text } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuthentication } from "../../hooks/useAuthentication";
import { RootState } from "../../store";
import { AuthTokenField } from "../AuthTokenField";

export const ProfilePage = () => {
  const username = useSelector<RootState, string>(state => state.users.username);
  const { copy, copied } = useClipboard({ timeout: 1500 });
  const { token, regenerateToken } = useAuthentication();
  const [opened, setOpened] = useState(false);

  return <div>
    <p>Username: {username}</p>
    <p>My auth token: <AuthTokenField authToken={token} revealLength={4} /></p>
    <Group spacing={15}>
      <Button variant="outline" onClick={() => copy(token)} color={copied ? "green" : ""}>{copied ? "Copied!" : "Copy key"}</Button>
      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        placement="center"
        target={<Button variant="outline" onClick={() => setOpened(true)}>Regenerate token</Button>}
      >
        <Text mb={10}>Are you sure?</Text>
        <Button variant="outline" mr={10} onClick={() => setOpened(false)}>Cancel</Button>
        <Button variant="filled" color="red" onClick={() => {
          regenerateToken();
          setOpened(false);
        }}>Yes</Button>
      </Popover>
    </Group>
  </div >;
};