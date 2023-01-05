import { Anchor, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns/esm";
import { useAuthentication } from "../../hooks/useAuthentication";
import { WithTooltip } from "../WithTooltip/WithTooltip";
import { TokenField } from "../TokenField/TokenField";
import { Link } from "react-router-dom";
import { useI18nContext } from "../../i18n/i18n-react";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import { SmoothChartsSelector } from "../SmoothChartsSelector/SmoothChartsSelector";
import { DefaultDayRangeSelector } from "../DefaultDayRangeSelector/DefaultDayRangeSelector";
import ChangePasswordForm from "../ChangePasswordForm";
import { useAccount } from "../../hooks/useAccount";
import { showNotification } from "@mantine/notifications";
import { ButtonWithConfirmation } from "../ButtonWithConfirmation/ButtonWithConfirmation";

export const ProfilePage = () => {
  const {
    token,
    regenerateToken,
    regenerateFriendCode,
    username,
    friendCode,
    registrationTime,
    changePassword,
    isPublic
  } = useAuthentication();

  const { LL } = useI18nContext();
  const { changeAccountVisibility } = useAccount();

  if (!registrationTime || !token || !friendCode || !username) return <Text>{LL.profile.notLoggedIn()}</Text>;

  return <div>
    <Title order={2}>{LL.profile.title()}</Title>
    <Text mt={15}>{LL.profile.username({ username })}</Text>
    <Text mt={15}>{LL.profile.registrationTime({
      registrationTime: format(registrationTime, "d.M.yyyy HH:mm")
    })}</Text>
    <Stack mt={40} spacing={15}>
      <Title order={2}>{LL.profile.account.title()}</Title>
      <Title order={3}>{LL.profile.changePassword.title()}</Title>
      <ChangePasswordForm onChangePassword={changePassword} />
      <WithTooltip
        tooltipLabel={<Text>{LL.profile.accountVisibility.description()}</Text>}
      >
        <Title order={3}>{LL.profile.accountVisibility.title()}</Title>
      </WithTooltip>
      <div>
        <ButtonWithConfirmation
          color={"red"}
          onClick={() => {
            changeAccountVisibility(!isPublic).catch(() => showNotification({
              title: LL.error(),
              color: "red",
              message: LL.unknownErrorOccurred()
            }));
          }}>
          {isPublic ? LL.profile.accountVisibility.makePrivate() : LL.profile.accountVisibility.makePublic()}
        </ButtonWithConfirmation>
      </div>
    </Stack>
    <Stack mt={40} spacing={15}>
      <WithTooltip
        tooltipLabel={<Text>{LL.profile.authenticationToken.tooltip.label()}{" "}
          <Anchor component={Link} to="/extensions">{LL.profile.authenticationToken.tooltip.install()}</Anchor>
        </Text>}
      >
        <Title order={3}>{LL.profile.authenticationToken.title()}</Title>
      </WithTooltip>
      <TokenField value={token} regenerate={regenerateToken} censorable revealLength={4} />
    </Stack>
    <Stack mt={40} spacing={15}>
      <WithTooltip tooltipLabel={<Text>{LL.profile.friendCode.tooltip()}</Text>}>
        <Title order={3}>{LL.profile.friendCode.title()}</Title>
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
      <Title order={2}>{LL.profile.settings.title()}</Title>
      <SmoothChartsSelector />
      <LanguageSelector />
      <DefaultDayRangeSelector />
    </Stack>
  </div>;
};
