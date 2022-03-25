import { Anchor, Center, Group, Text, Title } from "@mantine/core";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React from "react";
import Neovim from "../../images/neovim.svg";
import Vscode from "../../images/vscode.svg";

export const ExtensionBlock = ({ logo, downloadLink, sourceCodeLink, text }: { logo: React.ReactNode, downloadLink: string, sourceCodeLink: string, text: string }) => {
  // TODO: Determine source code icon based on sourceCodeLink (for example, if sourceCodeLink contains "gitlab", use GitLab icon)
  return <Group sx={{ width: "100%" }}>
    <Center style={{ minWidth: 50 }}>
      {logo}
    </Center>
    <Anchor href={downloadLink} sx={{ flex: 1 }} size="lg">{text}</Anchor>
    <Group spacing={10}>
      <Anchor href={sourceCodeLink} variant="text">
        <GitHubLogoIcon height={20} width={20} />
      </Anchor>
    </Group>
  </Group>;
};

export const ExtensionsPage = () => {
  return <>
    <Title order={1} mb={5}>Extensions</Title>
    <Text>Download the Testaustime extension for your favorite code editor!</Text>
    <Group spacing={25} direction="column" mt={30}>
      <ExtensionBlock
        logo={<img src={Vscode} height={40} />}
        downloadLink="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime"
        sourceCodeLink="https://github.com/Testausserveri/testaustime-vscode"
        text="Download Testaustime for Visual Studio Code"
      />
      <ExtensionBlock
        logo={<img src={Neovim} height={40} />}
        downloadLink="https://lajp.fi/static/testaustime-nvim"
        sourceCodeLink="https://github.com/lajp/testaustime-nvim"
        text="Download Testaustime for NeoVim"
      />
    </Group>
  </>;
};