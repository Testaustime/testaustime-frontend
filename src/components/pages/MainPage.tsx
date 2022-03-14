import { Anchor, Group } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Dashboard } from "../Dashboard";

export const MainPage = () => {
  const { isLoggedIn } = useAuthentication();

  return <div>
    {isLoggedIn ? <>
      <Dashboard />
    </> : <>
      <p>TestausTime is the ultimate tool for tracking time of your coding sessions. Show the world how dedicated you are to your projects.</p>
      <h2>Editor extensions</h2>
      <Group spacing={15} direction="column">
        <Anchor href="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime">Visual Studio Code</Anchor>
        <Anchor href="https://github.com/lajp/testaustime-nvim">NeoVim</Anchor>
      </Group>
    </>}
  </div>;
};