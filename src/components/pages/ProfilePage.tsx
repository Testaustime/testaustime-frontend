import { Anchor, Checkbox, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns/esm";
import useAuthentication from "../../hooks/UseAuthentication";
import { WithTooltip } from "../WithTooltip";
import { TokenField } from "../TokenField/TokenField";
import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";
import { useI18nContext } from "../../i18n/i18n-react";
import { Locales } from "../../i18n/i18n-types";

export const ProfilePage = () => {
  const {
    token,
    regenerateToken,
    regenerateFriendCode,
    username,
    friendCode,
    registrationTime
  } = useAuthentication();

  const {
    smoothCharts, setSmoothCharts,
    language, setLanguage
  } = useSettings();
  const { LL } = useI18nContext();

  if (!registrationTime || !token || !friendCode || !username) return <Text>{LL.profile.notLoggedIn()}</Text>;

  return <div>
    <Title order={2}>{LL.profile.title()}</Title>
    <Text mt={15}>{LL.profile.username({ username })}</Text>
    <Text mt={15}>{LL.profile.registrationTime({
      registrationTime: format(registrationTime, "d.M.yyyy HH:mm")
    })}</Text>
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
      <Group>
        <Checkbox
          checked={smoothCharts}
          onChange={e => setSmoothCharts(e.target.checked)}
          label={LL.profile.settings.smoothCharts()}
        />
      </Group>
      <Group>
        <Text>{LL.profile.settings.language()}</Text>
        <SegmentedControl
          data={[
            { label: "English 🇺🇸", value: "en" },
            { label: "Suomi 🇫🇮", value: "fi" }
          ]}
          value={language}
          onChange={value => setLanguage(value as Locales)}
        />
      </Group>
    </Stack>
  </div>;
};
