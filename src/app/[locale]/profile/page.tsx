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
import axios from "../../../axios";
import { cookies } from "next/headers";
import { ProfileVisibilityToggle } from "./ProfileVisibilityToggle";
import initTranslations from "../../i18n";
import { isAxiosError } from "axios";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { FriendCodeField } from "./FriendCodeField";
import { AuthTokenField } from "./AuthTokenField";
import { ApiUsersUserResponse } from "../../../types";
import { redirect } from "next/navigation";

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

  let data: ApiUsersUserResponse;
  try {
    const response = await axios.get<ApiUsersUserResponse>("/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
        // "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });
    data = response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      redirect("/login");
    }
    throw e;
  }

  const { username, friendCode, registrationTime } = {
    username: data.username,
    friendCode: data.friend_code,
    registrationTime: data.registration_time,
  };

  const { t } = await initTranslations(locale, ["common"]);

  if (!token) {
    return redirect("/login");
  }

  const tokenFieldTexts = {
    copy: t("copyToken.copy"),
    copied: t("copyToken.copied"),
    hide: t("copyToken.hide"),
    reveal: t("copyToken.reveal"),
    regenerate: t("copyToken.regenerate"),
    error: t("error"),
    unknownErrorOccurred: t("unknownErrorOccurred"),
  };

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
        <ChangePasswordForm
          texts={{
            oldPassword: {
              title: t("profile.changePassword.oldPassword"),
              required: t("profile.changePassword.old.required"),
              tooShort: t("profile.changePassword.old.tooShort", { min: 8 }),
              tooLong: t("profile.changePassword.old.tooLong", { max: 128 }),
            },
            newPassword: {
              title: t("profile.changePassword.newPassword"),
              required: t("profile.changePassword.new.required"),
              tooShort: t("profile.changePassword.new.tooShort", { min: 8 }),
              tooLong: t("profile.changePassword.new.tooLong", { max: 128 }),
            },
            newPasswordConfirm: {
              required: t("profile.changePassword.confirm.required"),
              noMatch: t("profile.changePassword.confirm.noMatch"),
              title: t("profile.changePassword.newPasswordConfirm"),
            },
            success: {
              title: t("profile.changePassword.success.title"),
              message: t("profile.changePassword.success.message"),
            },
            oldIncorrect: t("profile.changePassword.old.incorrect"),
            newInvalid: t("profile.changePassword.new.invalid"),
            error: t("error"),
            submit: t("profile.changePassword.submit"),
          }}
        />
        <WithTooltip
          tooltipLabel={
            <Text>{t("profile.accountVisibility.description")}</Text>
          }
        >
          <Title order={3}>{t("profile.accountVisibility.title")}</Title>
        </WithTooltip>
        <div>
          <ProfileVisibilityToggle
            isPublicInitial={data.is_public}
            texts={{
              makePrivate: t("profile.accountVisibility.makePrivate"),
              makePublic: t("profile.accountVisibility.makePublic"),
              error: t("error"),
              unknownErrorOccurred: t("unknownErrorOccurred"),
            }}
          />
        </div>
        <Title order={3}>{t("profile.deleteAccount.title")}</Title>
        <div>
          <DeleteAccountButton
            username={data.username}
            texts={{
              button: t("profile.deleteAccount.button"),
              modal: {
                title: t("profile.deleteAccount.modal.title"),
              },
            }}
          />
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
        <AuthTokenField token={token} texts={tokenFieldTexts} />
      </Stack>
      <Stack mt={40} gap={15}>
        <WithTooltip
          tooltipLabel={<Text>{t("profile.friendCode.tooltip")}</Text>}
        >
          <Title order={3}>{t("profile.friendCode.title")}</Title>
        </WithTooltip>
        <FriendCodeField friendCode={friendCode} texts={tokenFieldTexts} />
      </Stack>
      <Stack mt={40} gap={15}>
        <Title order={2}>{t("profile.settings.title")}</Title>
        <SmoothChartsSelector
          texts={{
            smoothCharts: t("profile.settings.smoothCharts"),
          }}
        />
        <LanguageSelector
          locale={locale}
          texts={{
            label: t("profile.settings.language"),
          }}
        />
        <DefaultDayRangeSelector
          texts={{
            label: t("profile.settings.defaultDayRange"),
            options: {
              week: t("dashboard.timeFilters.week"),
              month: t("dashboard.timeFilters.month"),
              all: t("dashboard.timeFilters.all"),
            },
          }}
        />
      </Stack>
    </div>
  );
}
