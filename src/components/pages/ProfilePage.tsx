import { Anchor, Checkbox, Group, Text, Title } from "@mantine/core";
import { format } from "date-fns/esm";
import useAuthentication from "../../hooks/UseAuthentication";
import { WithTooltip } from "../WithTooltip";
import { TokenField } from "../TokenField/TokenField";
import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

export const ProfilePage = () => {
  const {
    token,
    regenerateToken,
    regenerateFriendCode,
    username,
    friendCode,
    registrationTime
  } = useAuthentication();

  const { smoothCharts, setSmoothCharts } = useSettings();

  if (!registrationTime || !token || !friendCode) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title order={2}>My profile</Title>
    <Text mt={15}>Username: {username}</Text>
    <Text mt={15}>Registration time: {format(registrationTime, "d.M.yyyy HH:mm")}</Text>
    <Group direction="column" mt={40} spacing={15}>
      <WithTooltip
        tooltipLabel={<Text>This token is used for authentication in your code editor.{" "}
          <Anchor component={Link} to="/extensions">Get your extension from here!</Anchor>
        </Text>}
      >
        <Title order={3}>Authentication token</Title>
      </WithTooltip>
      <TokenField value={token} regenerate={regenerateToken} censorable revealLength={4} />
    </Group>
    <Group direction="column" mt={40} spacing={15}>
      <WithTooltip tooltipLabel={<Text>This code is used for sharing your data with your friends.</Text>}>
        <Title order={3}>Friend code</Title>
      </WithTooltip>
      <TokenField value={"ttfc_" + friendCode} regenerate={regenerateFriendCode} />
    </Group>
    <Title order={2} mt={40}>Settings</Title>
    <Group mt={15}>
      <Checkbox checked={smoothCharts} onChange={e => setSmoothCharts(e.target.checked)} label="Smooth charts" />
    </Group>
  </div>;
};
