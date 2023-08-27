export interface CensorableProps {
  authToken: string;
  revealLength: number;
  revealed?: boolean;
  hiddenCharacter?: string;
  textFormatter?: (currentValue: string) => string;
}

export const Censorable = ({
  authToken,
  revealLength,
  revealed,
  hiddenCharacter = "*",
  textFormatter = (currentValue: string) => currentValue,
}: CensorableProps) => {
  if (!authToken) {
    return null;
  }

  const value = revealed
    ? authToken
    : authToken.slice(0, revealLength) +
      hiddenCharacter.repeat(authToken.length - revealLength);

  return <code>{textFormatter(value)}</code>;
};
