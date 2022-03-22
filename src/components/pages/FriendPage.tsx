import { Text } from "@mantine/core";
import useAuthentication from "../../hooks/UseAuthentication";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Friendboard } from "../Friendboard";

export const FriendPage = () => {
  const { isLoggedIn } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  if (!isLoggedIn) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Friendboard />
  </div>;
};