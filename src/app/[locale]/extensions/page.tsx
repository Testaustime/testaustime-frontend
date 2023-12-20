import { GitHubLogoIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import initTranslations from "../../i18n";
import { ReactNode } from "react";
import styles from "./styles.module.css";
import { Anchor, Stack, Title, Text } from "@mantine/core";
import { DataCardContainer } from "../../../components/DataCard/DataCardContainer";
import Image from "next/image";

interface ExtensionBlockProps {
  logo: string;
  alt: string;
  downloadLink: string;
  sourceCodeLink: string;
  text: string;
}

const ExtensionBlock = ({
  logo,
  alt,
  downloadLink,
  sourceCodeLink,
  text,
}: ExtensionBlockProps) => {
  // Icon map for source code icons
  const iconMap: Record<string, ReactNode> = {
    // Root domain in lower case to icon element
    github: <GitHubLogoIcon height={20} width={20} />,
  };

  return (
    <DataCardContainer className={styles.wrapper} withoutPadding>
      <div className={styles.firstSection}>
        <Image
          className={styles.logo}
          src={logo}
          alt={alt}
          width={40}
          height={40}
        />
        <div className={styles.spacer} />
        <Anchor href={downloadLink} size="lg">
          {text}
        </Anchor>
      </div>
      <Anchor
        href={sourceCodeLink}
        variant="text"
        className={styles.iconContainer}
      >
        {iconMap[new URL(sourceCodeLink).hostname.split(".").reverse()[1]] ?? (
          <QuestionMarkIcon height={20} width={20} className={styles.icon} />
        )}
      </Anchor>
    </DataCardContainer>
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
            logo="/images/vscode.svg"
            alt="Visual Studio Code logo"
            downloadLink="https://marketplace.visualstudio.com/items?itemName=testausserveri-ry.testaustime"
            sourceCodeLink="https://github.com/Testausserveri/testaustime-vscode"
            text={t("extensions.vscode")}
          />
          <ExtensionBlock
            logo="/images/neovim.svg"
            alt="Neovim logo"
            downloadLink="https://github.com/Testaustime/testaustime.nvim"
            sourceCodeLink="https://github.com/Testaustime/testaustime.nvim"
            text={t("extensions.neovim")}
          />
          <ExtensionBlock
            logo="/images/intellij.svg"
            alt="IntelliJ logo"
            downloadLink="https://plugins.jetbrains.com/plugin/19408-testaustime/"
            sourceCodeLink="https://github.com/Testaustime/testaustime-intellij/"
            text={t("extensions.intellij")}
          />
          <ExtensionBlock
            logo="/images/micro.svg"
            alt="Micro logo"
            downloadLink="https://github.com/Testaustime/testaustime-micro"
            sourceCodeLink="https://github.com/Testaustime/testaustime-micro"
            text={t("extensions.micro")}
          />
          <ExtensionBlock
            logo="/images/sublime.svg"
            alt="Sublime Text logo"
            downloadLink="https://github.com/Testaustime/testaustime-sublime/releases/latest"
            sourceCodeLink="https://github.com/Testaustime/testaustime-sublime"
            text={t("extensions.sublime")}
          />
        </Stack>
      </div>
    </>
  );
}
