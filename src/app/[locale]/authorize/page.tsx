import { Text, Button, Stack } from "@mantine/core";
import initTranslations from "../../i18n";
import { cookies } from "next/headers";
import { getMe } from "../../../api/usersApi";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function AuthorizePage({
  params: { locale },
  searchParams: { editor },
}: {
  params: { locale: string };
  searchParams: { editor?: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  const loginUrls = new Map(
    Object.entries({
      vscode: `/login?redirect=${encodeURIComponent("/authorize?editor=vscode")}`,
      cursor: `/login?redirect=${encodeURIComponent("/authorize?editor=cursor")}`,
    }),
  );
  const loginUrl = loginUrls.get(editor ?? "vscode");

  if (loginUrl === undefined) {
    // Make this prettier
    return <div>{t("authorize.unsupportedEditor")}</div>;
  }

  const token = cookies().get("token")?.value;
  if (!token) {
    redirect(loginUrl);
  }

  const redirectUrls = new Map(
    Object.entries({
      vscode: `vscode://testausserveri-ry.testaustime/authorize?token=${token}`,
      cursor: `cursor://testausserveri-ry.testaustime-cursor/authorize?token=${token}`,
    }),
  );
  const redirectUrl = redirectUrls.get(editor ?? "vscode");
  if (redirectUrl === undefined) {
    // Make this prettier
    return <div>{t("authorize.unsupportedEditor")}</div>;
  }

  const me = await getMe();
  if (!me || "error" in me) {
    redirect(loginUrl);
  }

  const { username } = me;

  const editorNames = new Map(
    Object.entries({
      vscode: "Visual Studio Code",
      cursor: "Cursor",
    }),
  );
  const editorName = editorNames.get(editor ?? "vscode");

  if (editorName === undefined) {
    return <div>{t("authorize.invalidEditor")}</div>;
  }

  return (
    <Stack align="center" gap="xl">
      <Image
        src="/images/vscode.svg"
        alt="Visual Studio Code"
        width={40}
        height={40}
      />
      <Text>{t("authorize.body", { editor: editorName })}</Text>
      <Button
        component="a"
        href={redirectUrl}
      >
        {t("authorize.continue", { username })}
      </Button>
      <Text c="dark.2">
        {t("authorize.notWorking.text")}&nbsp;
        <Link href="profile">{t("authorize.notWorking.link")}</Link>
      </Text>
    </Stack>
  );
}
