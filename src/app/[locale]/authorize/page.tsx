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
    return <div>Unsupported editor</div>;
  }

  const token = cookies().get("token")?.value;
  if (!token) {
    redirect(loginUrl);
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
    return <div>Invalid editor</div>;
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
        href={loginUrl}
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
