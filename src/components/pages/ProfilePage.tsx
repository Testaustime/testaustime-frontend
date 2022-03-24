import { Button, Group, Popover, Text, Title } from "@mantine/core";
import { useBooleanToggle, useClipboard } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { ClipboardIcon, EyeClosedIcon, EyeOpenIcon, UpdateIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/esm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuthentication from "../../hooks/UseAuthentication";
import AuthTokenField from "../AuthTokenField";

export const ProfilePage = () => {
  const { copy, copied, reset } = useClipboard({ timeout: 2000 });
  const { token, regenerateToken, username, isLoggedIn, friendCode, registrationTime } = useAuthentication();
  const [confirmationOpened, setConfirmationOpened] = useState(false);
  const [isTokenRevealed, toggleIsTokenRevealed] = useBooleanToggle(false);
  const navigate = useNavigate();
  const notifications = useNotifications();

  useEffect(() => {
    if (!isLoggedIn || !registrationTime || !token) {
      navigate("/login");
    }
    return reset;
  }, []);

  if (!isLoggedIn || !registrationTime || !token) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title order={2}>My profile</Title>
    <Text mt={15}>Username: {username}</Text>
    <Text mt={15}>Registration time: {format(registrationTime, "d.M.yyyy HH:mm")}</Text>
    <Title order={3} mt={40} mb={5}>Authentication token</Title>
    <Text>My token: <AuthTokenField authToken={token} revealLength={4} revealed={isTokenRevealed} /></Text>
    <Group spacing={15} mt={25}>
      <Button variant="filled" onClick={() => copy(token)} color={copied ? "green" : ""} leftIcon={<ClipboardIcon />}>{copied ? "Copied!" : "Copy"}</Button>
      <Button variant="outline" onClick={() => toggleIsTokenRevealed()} leftIcon={isTokenRevealed ? <EyeClosedIcon /> : <EyeOpenIcon />}>{isTokenRevealed ? "Hide" : "Reveal"}</Button>
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
          regenerateToken().catch(error => {
            notifications.showNotification({
              title: "Error",
              color: "red",
              message: String(error || "An unknown error occurred")
            });
          });
          setConfirmationOpened(false);
        }}>Yes</Button>
      </Popover>
    </Group>

    <Title order={3} mt={40} mb={5}>Friend code</Title>
    <Text>My friend code: ttfc_{friendCode}</Text>
  </div >;
};
