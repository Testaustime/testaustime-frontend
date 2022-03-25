import { Anchor, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import useAuthentication from "../../hooks/UseAuthentication";
import { Dashboard } from "../Dashboard";

export const MainPage = () => {
  const { isLoggedIn } = useAuthentication();

  return <div>
    {isLoggedIn ? <>
      <Dashboard />
    </> : <>
      <Text mb={20}>TestausTime is the ultimate tool for tracking time of your coding sessions. Show the world how dedicated you are to your projects.</Text>
      <Anchor component={Link} to="/extensions">Get the editor extensions from here!</Anchor>
    </>}
  </div>;
};