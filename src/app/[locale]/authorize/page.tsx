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

  const loginUrl =
    editor == "vscode"
      ? `/login?redirect=${encodeURIComponent("/authorize?editor=vscode")}`
      : "/login";

  const token = cookies().get("token")?.value;
  if (!token) {
    redirect(loginUrl);
  }

  const me = await getMe();
  if (!me || "error" in me) {
    redirect(loginUrl);
  }

  const { username } = me;

  return (
    <Stack align="center" gap="xl">
      <Image
        src="/images/vscode.svg"
        alt="Visual Studio Code"
        width={40}
        height={40}
      />
      <Text>{t("authorize.body")}</Text>
      <Button
        component="a"
        href={`vscode://testausserveri-ry.testaustime/authorize?token=${token}`}
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
