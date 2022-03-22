export interface AuthTokenFieldProps {
  authToken: string,
  revealLength: number,
  revealed?: boolean,
  hiddenCharacter?: string
}

export const AuthTokenField = ({
  authToken,
  revealLength,
  revealed,
  hiddenCharacter = "*"
}: AuthTokenFieldProps) => {
  if (!authToken) {
    return null;
  }
  return revealed ?
    <code>{authToken}</code> :
    <code>{authToken.slice(0, revealLength) + hiddenCharacter.repeat(authToken.length - revealLength)}</code>;
};