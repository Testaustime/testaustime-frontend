export const AuthTokenField = ({ authToken, revealLength }: { authToken: string, revealLength: number }) => {
  if (!authToken) {
    return null;
  }
  return <code>{authToken.slice(0, revealLength) + "*".repeat(authToken.length - revealLength)}</code>;
};