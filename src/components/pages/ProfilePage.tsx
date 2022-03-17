import { Button, Group, Popover, Text, Title } from "@mantine/core";
import { useBooleanToggle, useClipboard } from "@mantine/hooks";
import { ClipboardIcon, EyeClosedIcon, EyeOpenIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../hooks/useAuthentication";
import { AuthTokenField } from "../AuthTokenField";

export const ProfilePage = () => {
  const { copy, copied } = useClipboard({ timeout: 2000 });
  const { token, regenerateToken, username, isLoggedIn } = useAuthentication();
  const [confirmationOpened, setConfirmationOpened] = useState(false);
  const [revealedToken, toggleRevealToken] = useBooleanToggle(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  if (!isLoggedIn) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title order={2}>My profile</Title>
    <Text mt={15}>Username: {username}</Text>
    <Title order={3} mt={40} mb={5}>Authentication token</Title>
    <Text>My token: <AuthTokenField authToken={token} revealLength={revealedToken ? token.length : 4} /></Text>
    <Group spacing={15} mt={25}>
      <Button variant="filled" onClick={() => copy(token)} color={copied ? "green" : ""} leftIcon={<ClipboardIcon />}>{copied ? "Copied!" : "Copy"}</Button>
      <Button variant="outline" onClick={() => toggleRevealToken()} leftIcon={revealedToken ? <EyeClosedIcon /> : <EyeOpenIcon />}>{revealedToken ? "Hide" : "Reveal"}</Button>
      <Popover
        opened={confirmationOpened}
        onClose={() => setConfirmationOpened(false)}
        position="bottom"
        placement="center"
        target={<Button variant="outline" onClick={() => setConfirmationOpened(true)} leftIcon={<UpdateIcon />}>Regenerate</Button>}
      >
        <Text mb={10}>Are you sure?</Text>
        <Button variant="outline" mr={10} onClick={() => setConfirmationOpened(false)}>Cancel</Button>
        <Button variant="filled" color="red" onClick={() => {
          regenerateToken();
          setConfirmationOpened(false);
        }}>Yes</Button>
      </Popover>
    </Group>
  </div >;
};