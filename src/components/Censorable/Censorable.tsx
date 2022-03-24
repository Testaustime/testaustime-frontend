export interface CensorableProps {
  authToken: string,
  revealLength: number,
  revealed?: boolean,
  hiddenCharacter?: string
}

export const Censorable = ({
  authToken,
  revealLength,
  revealed,
  hiddenCharacter = "*"
}: CensorableProps) => {
  if (!authToken) {
    return null;
  }
  return revealed ?
    <code>{authToken}</code> :
    <code>{authToken.slice(0, revealLength) + hiddenCharacter.repeat(authToken.length - revealLength)}</code>;
};