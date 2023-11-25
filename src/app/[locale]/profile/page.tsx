// TODO: Remove
/* eslint-disable @typescript-eslint/no-throw-literal */
import { Anchor, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";
import WithTooltip from "../../../components/WithTooltip";
import Link from "next/link";
import LanguageSelector from "../../../components/LanguageSelector";
import SmoothChartsSelector from "../../../components/SmoothChartsSelector";
import DefaultDayRangeSelector from "../../../components/DefaultDayRangeSelector";
import ChangePasswordForm from "../../../components/ChangePasswordForm";
import { cookies } from "next/headers";
import { ProfileVisibilityToggle } from "./ProfileVisibilityToggle";
import initTranslations from "../../i18n";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { FriendCodeField } from "./FriendCodeField";
import { AuthTokenField } from "./AuthTokenField";
import { redirect } from "next/navigation";
import { getMe } from "../../../api/usersApi";

export type ProfilePageProps = {
  username: string;
  friendCode: string;
  registrationTime: string;
  isPublic: boolean;
  token: string;
  locale: string;
};

export default async function ProfilePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const me = await getMe();
  if ("error" in me) {
    if (me.error === "Unauthorized") {
      redirect("/login");
    } else if (me.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(me.error);
    }
  }

  const { username, friendCode, registrationTime } = {
    username: me.username,
    friendCode: me.friend_code,
    registrationTime: me.registration_time,
  };

  const { t } = await initTranslations(locale, ["common"]);

  if (!token) {
    return redirect("/login");
  }

  return (
    <div>
      <Title order={2}>{t("profile.title")}</Title>
      <Text mt={15}>{t("profile.username", { username })}</Text>
      <Text mt={15}>
        {t("profile.registrationTime", {
          registrationTime: format(
            new Date(registrationTime),
            "d.M.yyyy HH:mm",
          ),
        })}
      </Text>
      <Stack mt={40} gap={15}>
        <Title order={2}>{t("profile.account.title")}</Title>
        <Title order={3}>{t("profile.changePassword.title")}</Title>
        <ChangePasswordForm />
        <WithTooltip
          tooltipLabel={
            <Text>{t("profile.accountVisibility.description")}</Text>
          }
        >
          <Title order={3}>{t("profile.accountVisibility.title")}</Title>
        </WithTooltip>
        <div>
          <ProfileVisibilityToggle isPublic={me.is_public} />
        </div>
        <Title order={3}>{t("profile.deleteAccount.title")}</Title>
        <div>
          <DeleteAccountButton username={me.username} />
        </div>
      </Stack>
      <Stack mt={40} gap={15}>
        <WithTooltip
          tooltipLabel={
            <Text>
              {t("profile.authenticationToken.tooltip.label")}{" "}
              <Anchor component={Link} href={`/${locale}/extensions`}>
                {t("profile.authenticationToken.tooltip.install")}
              </Anchor>
            </Text>
          }
        >
          <Title order={3}>{t("profile.authenticationToken.title")}</Title>
        </WithTooltip>
        <AuthTokenField token={token} />
      </Stack>
      <Stack mt={40} gap={15}>
        <WithTooltip
          tooltipLabel={<Text>{t("profile.friendCode.tooltip")}</Text>}
        >
          <Title order={3}>{t("profile.friendCode.title")}</Title>
        </WithTooltip>
        <FriendCodeField friendCode={friendCode} />
      </Stack>
      <Stack mt={40} gap={15}>
        <Title order={2}>{t("profile.settings.title")}</Title>
        <SmoothChartsSelector />
        <LanguageSelector locale={locale} />
        <DefaultDayRangeSelector />
      </Stack>
    </div>
  );
}
