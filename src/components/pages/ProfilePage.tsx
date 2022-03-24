import { Text, Title } from "@mantine/core";
import { format } from "date-fns/esm";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthentication from "../../hooks/UseAuthentication";
import { TokenField } from "../TokenField/TokenField";

export const ProfilePage = () => {
  const {
    token,
    regenerateToken,
    regenerateFriendCode,
    username,
    isLoggedIn,
    friendCode,
    registrationTime
  } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  if (!isLoggedIn || !registrationTime || !token || !friendCode) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title order={2}>My profile</Title>
    <Text mt={15}>Username: {username}</Text>
    <Text mt={15}>Registration time: {format(registrationTime, "d.M.yyyy HH:mm")}</Text>
    <Title order={3} mt={40} mb={5}>Authentication token</Title>
    <TokenField value={token} regenerate={regenerateToken} censorable revealLength={4} />
    <Title order={3} mt={40} mb={5}>Friend code</Title>
    <TokenField value={"ttfc_" + friendCode} regenerate={regenerateFriendCode} />
  </div >;
};
