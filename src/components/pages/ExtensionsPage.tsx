import { Anchor, Center, createStyles, Group, Stack, Text, Title } from "@mantine/core";
import { GitHubLogoIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import React, { ReactNode } from "react";
import { ReactComponent as Neovim } from "../../images/neovim.svg";
import { ReactComponent as Vscode } from "../../images/vscode.svg";
import { ReactComponent as IntelliJ } from "../../images/intellij.svg";
import { ReactComponent as Micro } from "../../images/micro.svg";
import { useI18nContext } from "../../i18n/i18n-react";

interface ExtensionBlockProps {
  logo: React.ReactNode,
  downloadLink: string,
  sourceCodeLink: string,
  text: string
}

const useStyles = createStyles(theme => ({
  wrapper: {
    backgroundColor: theme.colorScheme === "dark" ? "#282a36" : "#fff",
    borderRadius: "10px",
    border: `1px solid ${theme.colorScheme === "dark" ? "#222" : "#ccc"}`
  },
  text: {
    padding: "2rem"
  },
  sideContainer: {
    "@media (max-width: 685px)": {
      width: "100%",
      justifyContent: "flex-end",
      marginTop: "-15px"
    }
  },
  iconContainer: {
    backgroundColor: theme.colorScheme === "dark" ? "#22242e" : "#eef1ff",
    padding: "calc(2rem + 2px)",
    "&:hover": {
      filter: "brightness(0.95)"
    },
    borderRadius: "0px 10px 10px 0px",
    "@media (max-width: 685px)": {
      width: "100%",
      height: "50px",
      padding: "unset",
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "0px 0px 10px 10px"
    }
  },
  icon: {
    transition: "ease-in-out filter 0.2s"
  },
  logo: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
    "@media (max-width: 320px)": {
      width: "100%",
      marginTop: "2rem",
      paddingLeft: "0px",
      paddingRight: "0px"
    }
  },
  spacer: {
    height: "3rem",
    marginLeft: "-15px",
    borderRadius: "10px",
    backgroundColor: "#C1C2C5",
    width: "1px",
    "@media (max-width: 320px)": {
      height: "1px",
      width: "50%",
      marginTop: "2rem",
      marginLeft: "25%"
    }
  }
}));

export const ExtensionBlock = ({ logo, downloadLink, sourceCodeLink, text }: ExtensionBlockProps) => {
  const { classes } = useStyles();

  // Icon map for source code icons
  const iconMap: Record<string, ReactNode> = { // Root domain in lower case to icon element
    "github": <GitHubLogoIcon height={20} width={20} className={classes.icon} />
  };

  return <Group sx={{ width: "100%" }} className={classes.wrapper}>
    <Center className={classes.logo}>
      {logo}
    </Center>
    <Anchor className={classes.spacer} />
    <Anchor href={downloadLink} sx={{ flex: 1 }} size="lg" className={classes.text}>{text}</Anchor>
    <Group spacing={10} className={classes.sideContainer}>
      <Anchor href={sourceCodeLink} variant="text" className={classes.iconContainer}>
        {iconMap[new URL(sourceCodeLink).hostname.split(".").reverse()[1]] ??
          <QuestionMarkIcon height={20} width={20} className={classes.icon} />
        }
      </Anchor>
    </Group>
  </Group>;
};


export const ExtensionsPage = () => {
  const { LL } = useI18nContext();

  return <div style={{ height: "calc(100% - 36px - 50px - 80px)" }}>
    <Title order={1} mb={5}>{LL.extensions.title()}</Title>
    <Text>{LL.extensions.body()}</Text>
    <Stack spacing={25} mt={30}>
      <ExtensionBlock
        logo={<Vscode width={40} height={40} />}
        downloadLink="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime"
        sourceCodeLink="https://github.com/Testausserveri/testaustime-vscode"
        text={LL.extensions.vscode()}
      />
      <ExtensionBlock
        logo={<Neovim width={40} height={40} />}
        downloadLink="https://github.com/Testaustime/testaustime.nvim"
        sourceCodeLink="https://github.com/Testaustime/testaustime.nvim"
        text={LL.extensions.neovim()}
      />
      <ExtensionBlock
        logo={<IntelliJ width={40} height={40} />}
        downloadLink="https://plugins.jetbrains.com/plugin/19408-testaustime/"
        sourceCodeLink="https://github.com/Testaustime/testaustime-intellij/"
        text={LL.extensions.intellij()}
      />
      <ExtensionBlock
        logo={<Micro width={40} height={40} />}
        downloadLink="https://github.com/Testaustime/testaustime-micro"
        sourceCodeLink="https://github.com/Testaustime/testaustime-micro"
        text={LL.extensions.micro()}
      />
    </Stack>
  </div>;
};
