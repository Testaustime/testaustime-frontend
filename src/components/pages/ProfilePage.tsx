import { useClipboard } from "@mantine/hooks";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useAuthentication } from "../../hooks/useAuthentication";
import { RootState } from "../../store";

const AuthTokenField = ({ authToken, revealLength }: { authToken: string, revealLength: number }) => {
  return <code>{authToken.slice(0, revealLength) + "*".repeat(authToken.length - revealLength)}</code>;
};

const TokenButtons = styled.div`
  display: flex;
  gap: 15px;
`;

export const ProfilePage = () => {
  const username = useSelector<RootState, string>(state => state.users.username);
  const { copy, copied } = useClipboard({ timeout: 1500 });
  const { token, regenerateToken } = useAuthentication();

  return <div>
    <p>Username: {username}</p>
    <p>My auth token: <AuthTokenField authToken={token} revealLength={4} /></p>
    <TokenButtons>
      <button onClick={() => copy(token)}>{copied ? "Copied!" : "Copy key"}</button>
      <button onClick={() => regenerateToken()}>Regenerate token</button>
    </TokenButtons>
  </div>;
};