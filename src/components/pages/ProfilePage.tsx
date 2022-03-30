import { ActionIcon, Anchor, Group, Text, Title, Tooltip } from "@mantine/core";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/esm";
import { Link } from "react-router-dom";
import useAuthentication from "../../hooks/UseAuthentication";
import { TokenField } from "../TokenField/TokenField";

export const ProfilePage = () => {
  const {
    token,
    regenerateToken,
    regenerateFriendCode,
    username,
    friendCode,
    registrationTime
  } = useAuthentication();

  if (!registrationTime || !token || !friendCode) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title order={2}>My profile</Title>
    <Text mt={15}>Username: {username}</Text>
    <Text mt={15}>Registration time: {format(registrationTime, "d.M.yyyy HH:mm")}</Text>
    <Group direction="column" mt={40} spacing={15}>
      <Group spacing={10}>
        <Title order={3}>
          Authentication token
        </Title>
        <Tooltip
          allowPointerEvents
          wrapLines
          width={250}
          withArrow
          label={<Text>This token is used for authentication in your code editor. <Anchor component={Link} to="/extensions">Get your extension from here!</Anchor></Text>}>
          <ActionIcon size={30}>
            <QuestionMarkCircledIcon width={20} height={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <TokenField value={token} regenerate={regenerateToken} censorable revealLength={4} />
    </Group>
    <Title order={3} mt={40} mb={5}>Friend code</Title>
    <TokenField value={"ttfc_" + friendCode} regenerate={regenerateFriendCode} />
  </div >;
};
