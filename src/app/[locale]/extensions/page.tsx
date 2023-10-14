import { GitHubLogoIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import initTranslations from "../../i18n";
import { ReactNode } from "react";
import styles from "./page.module.css";
import { Anchor, Center, Group, Stack, Title, Text } from "@mantine/core";
import Neovim from "../../../../public/images/neovim.svg";
import Vscode from "../../../../public/images/vscode.svg";
import IntelliJ from "../../../../public/images/intellij.svg";
import Micro from "../../../../public/images/micro.svg";
import Sublime from "../../../../public/images/sublime.svg";

interface ExtensionBlockProps {
  logo: React.ReactNode;
  downloadLink: string;
  sourceCodeLink: string;
  text: string;
}

const ExtensionBlock = ({
  logo,
  downloadLink,
  sourceCodeLink,
  text,
}: ExtensionBlockProps) => {
  // Icon map for source code icons
  const iconMap: Record<string, ReactNode> = {
    // Root domain in lower case to icon element
    github: <GitHubLogoIcon height={20} width={20} className={styles.icon} />,
  };

  return (
    <Group style={{ width: "100%" }} className={styles.wrapper}>
      <Center className={styles.logo}>{logo}</Center>
      <Anchor className={styles.spacer} />
      <Anchor
        href={downloadLink}
        style={{ flex: 1 }}
        size="lg"
        className={styles.text}
      >
        {text}
      </Anchor>
      <Group gap={10} className={styles.sideContainer}>
        <Anchor
          href={sourceCodeLink}
          variant="text"
          className={styles.iconContainer}
        >
          {iconMap[
            new URL(sourceCodeLink).hostname.split(".").reverse()[1]
          ] ?? (
            <QuestionMarkIcon height={20} width={20} className={styles.icon} />
          )}
        </Anchor>
      </Group>
    </Group>
  );
};

export default async function ExtensionsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <>
      <div style={{ height: "calc(100% - 36px - 50px - 80px)" }}>
        <Title order={1} mb={5}>
          {t("extensions.title")}
        </Title>
        <Text>{t("extensions.body")}</Text>
        <Stack gap={25} mt={30}>
          <ExtensionBlock
            logo={<Vscode width={40} height={40} />}
            downloadLink="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime"
            sourceCodeLink="https://github.com/Testausserveri/testaustime-vscode"
            text={t("extensions.vscode")}
          />
          <ExtensionBlock
            logo={<Neovim width={40} height={40} />}
            downloadLink="https://github.com/Testaustime/testaustime.nvim"
            sourceCodeLink="https://github.com/Testaustime/testaustime.nvim"
            text={t("extensions.neovim")}
          />
          <ExtensionBlock
            logo={<IntelliJ width={40} height={40} />}
            downloadLink="https://plugins.jetbrains.com/plugin/19408-testaustime/"
            sourceCodeLink="https://github.com/Testaustime/testaustime-intellij/"
            text={t("extensions.intellij")}
          />
          <ExtensionBlock
            logo={<Micro width={40} height={40} />}
            downloadLink="https://github.com/Testaustime/testaustime-micro"
            sourceCodeLink="https://github.com/Testaustime/testaustime-micro"
            text={t("extensions.micro")}
          />
          <ExtensionBlock
            logo={<Sublime width={40} height={40} />}
            downloadLink="https://github.com/Testaustime/testaustime-sublime/releases/latest"
            sourceCodeLink="https://github.com/Testaustime/testaustime-sublime"
            text={t("extensions.sublime")}
          />
        </Stack>
      </div>
    </>
  );
}
