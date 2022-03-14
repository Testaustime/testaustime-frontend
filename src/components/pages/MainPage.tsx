import { Anchor, Group, Text, Title } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Dashboard } from "../Dashboard";

export const MainPage = () => {
  const { isLoggedIn } = useAuthentication();

  return <div>
    {isLoggedIn ? <>
      <Dashboard />
    </> : <>
      <Text>TestausTime is the ultimate tool for tracking time of your coding sessions. Show the world how dedicated you are to your projects.</Text>
      <Title order={2} mt={40} mb={20}>Editor extensions</Title>
      <Group spacing={15} direction="column">
        <Anchor href="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime">Visual Studio Code</Anchor>
        <Anchor href="https://github.com/lajp/testaustime-nvim">NeoVim</Anchor>
      </Group>
    </>}
  </div>;
};