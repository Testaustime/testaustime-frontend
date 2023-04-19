import { Anchor, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";
import { ApiUsersUserResponse, useAuthentication } from "../../hooks/useAuthentication";
import WithTooltip from "../../components/WithTooltip";
import TokenField from "../../components/TokenField";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import SmoothChartsSelector from "../../components/SmoothChartsSelector";
import DefaultDayRangeSelector from "../../components/DefaultDayRangeSelector";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { useAccount } from "../../hooks/useAccount";
import { showNotification } from "@mantine/notifications";
import ButtonWithConfirmation from "../../components/ButtonWithConfirmation";
import { useModals } from "@mantine/modals";
import ConfirmAccountDeletionModal from "../../components/ConfirmAccountDeletionModal";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "../../axios";

export type ProfilePageProps = {
  username: string,
  friendCode: string,
  registrationTime: string,
  isPublic: boolean,
  token: string
};

const ProfilePage = ({ username, friendCode, registrationTime, isPublic, token }: ProfilePageProps) => {
  const {
    regenerateToken,
    regenerateFriendCode,
    changePassword
  } = useAuthentication();

  const { t } = useTranslation();
  const { changeAccountVisibility, deleteAccount } = useAccount();

  const modals = useModals();

  const openDeleteAccountModal = () => {
    const id = modals.openModal({
      title: <Title>{t("profile.deleteAccount.modal.title")}</Title>,
      size: "xl",
      children: <ConfirmAccountDeletionModal
        onCancel={() => modals.closeModal(id)}
        onConfirm={async password => {
          await deleteAccount(password);
          modals.closeModal(id);
        }}
      />
    });
  };

  return <div>
    <Title order={2}>{t("profile.title")}</Title>
    <Text mt={15}>{t("profile.username", { username })}</Text>
    <Text mt={15}>{t("profile.registrationTime", {
      registrationTime: format(new Date(registrationTime), "d.M.yyyy HH:mm")
    })}</Text>
    <Stack mt={40} spacing={15}>
      <Title order={2}>{t("profile.account.title")}</Title>
      <Title order={3}>{t("profile.changePassword.title")}</Title>
      <ChangePasswordForm onChangePassword={changePassword} />
      <WithTooltip
        tooltipLabel={<Text>{t("profile.accountVisibility.description")}</Text>}
      >
        <Title order={3}>{t("profile.accountVisibility.title")}</Title>
      </WithTooltip>
      <div>
        <ButtonWithConfirmation
          color={"red"}
          onClick={() => {
            changeAccountVisibility(!isPublic).catch(() => showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred")
            }));
          }}>
          {isPublic ? t("profile.accountVisibility.makePrivate") : t("profile.accountVisibility.makePublic")}
        </ButtonWithConfirmation>
      </div>
      <Title order={3}>{t("profile.deleteAccount.title")}</Title>
      <div>
        <ButtonWithConfirmation
          color={"red"}
          onClick={() => {
            openDeleteAccountModal();
          }}>
          {t("profile.deleteAccount.button")}
        </ButtonWithConfirmation>
      </div>
    </Stack>
    <Stack mt={40} spacing={15}>
      <WithTooltip
        tooltipLabel={<Text>{t("profile.authenticationToken.tooltip.label")}{" "}
          <Anchor component={Link} href="/extensions">{t("profile.authenticationToken.tooltip.install")}</Anchor>
        </Text>}
      >
        <Title order={3}>{t("profile.authenticationToken.title")}</Title>
      </WithTooltip>
      <TokenField value={token} regenerate={regenerateToken} censorable revealLength={4} />
    </Stack>
    <Stack mt={40} spacing={15}>
      <WithTooltip tooltipLabel={<Text>{t("profile.friendCode.tooltip")}</Text>}>
        <Title order={3}>{t("profile.friendCode.title")}</Title>
      </WithTooltip>
      <TokenField
        value={friendCode}
        censorable
        revealLength={4}
        regenerate={regenerateFriendCode}
        copyFormatter={value => `ttfc_${value}`}
        textFormatter={value => `ttfc_${value}`}
      />
    </Stack>
    <Stack mt={40} spacing={15}>
      <Title order={2}>{t("profile.settings.title")}</Title>
      <SmoothChartsSelector />
      <LanguageSelector />
      <DefaultDayRangeSelector />
    </Stack>
  </div>;
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async ({ locale, req }) => {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  const response = await axios.get<ApiUsersUserResponse>(
    "/users/@me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress
      }
    }
  );

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
      username: response.data.username,
      friendCode: response.data.friend_code,
      registrationTime: response.data.registration_time,
      isPublic: response.data.is_public,
      token // This is very bad. https://github.com/Testaustime/testaustime-backend/issues/74
    }
  };
};

export default ProfilePage;
