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
import ChangeUsernameForm from "../../../components/ChangeUsernameForm";
import { TimeInHoursSelector } from "../../../components/TimeInHoursSelector/TimeInHoursSelector";

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
  if (!me) {
    redirect("/login");
  }

  if ("error" in me) {
    if (me.error === "Unauthorized") {
      redirect("/login");
    } else if (me.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(JSON.stringify(me));
    }
  }

  const { username, friendCode, registrationTime } = {
    username: me.username,
    friendCode: me.friend_code,
    registrationTime: me.registration_time,
  };

  const { t } = await initTranslations(locale, ["common"]);

  return (
    <Stack gap={32}>
      <Stack gap={16}>
        <Title order={2}>{t("profile.title")}</Title>
        <Text>{t("profile.username", { username })}</Text>
        <Text>
          {t("profile.registrationTime", {
            registrationTime: format(
              new Date(registrationTime),
              "d.M.yyyy HH:mm",
            ),
          })}
        </Text>
      </Stack>
      <Stack gap={32}>
        <Title order={2}>{t("profile.account.title")}</Title>
        <Stack gap="xs">
          <Title order={3}>{t("profile.changePassword.title")}</Title>
          <ChangePasswordForm />
        </Stack>
        <Stack gap="xs">
          <Title order={3}>{t("profile.changeUsername.title")}</Title>
          <ChangeUsernameForm />
        </Stack>
        <Stack gap="xs">
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
        </Stack>
        <Stack gap="xs">
          <Title order={3}>{t("profile.deleteAccount.title")}</Title>
          <div>
            <DeleteAccountButton username={me.username} />
          </div>
        </Stack>
        <Stack gap="xs">
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
          <AuthTokenField username={me.username} token={token} />
        </Stack>
        <Stack gap="xs">
          <WithTooltip
            tooltipLabel={<Text>{t("profile.friendCode.tooltip")}</Text>}
          >
            <Title order={3}>{t("profile.friendCode.title")}</Title>
          </WithTooltip>
          <FriendCodeField friendCode={friendCode} />
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Title order={2}>{t("profile.settings.title")}</Title>
        <SmoothChartsSelector />
        <LanguageSelector locale={locale} />
        <DefaultDayRangeSelector />
        <TimeInHoursSelector />
      </Stack>
    </Stack>
  );
}
