import { Button, Group, Text } from "@mantine/core";
import { useToggle, useClipboard } from "@mantine/hooks";
import { ClipboardIcon, EyeClosedIcon, EyeOpenIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useI18nContext } from "../../i18n/i18n-react";
import { ButtonWithConfirmation } from "../ButtonWithConfirmation/ButtonWithConfirmation";
import Censorable from "../Censorable";
import { showNotification } from "@mantine/notifications";

export interface TokenFieldProps {
  value: string,
  regenerate?: () => Promise<string>,
  censorable?: boolean,
  revealLength?: number,
  copyFormatter?: (currentValue: string) => string,
  textFormatter?: (currentValue: string) => string
}

export const TokenField = ({
  value,
  regenerate,
  censorable,
  revealLength,
  copyFormatter = (currentValue: string) => currentValue,
  textFormatter = (currentValue: string) => currentValue
}: TokenFieldProps) => {
  const { copy, copied, reset } = useClipboard({ timeout: 2000 });
  const [isTokenRevealed, toggleIsTokenRevealed] = useToggle([false, true]);

  const { LL } = useI18nContext();

  useEffect(() => {
    return reset;
  }, []);

  return <div>
    {censorable ?
      <Text>
        <Censorable
          authToken={value}
          revealLength={revealLength || 0}
          revealed={isTokenRevealed}
          textFormatter={textFormatter}
        />
      </Text> :
      <Text><code>{textFormatter(value)}</code></Text>}
    <Group spacing="md" mt="sm">
      <Button
        variant="filled"
        onClick={() => copy(copyFormatter(value))}
        color={copied ? "green" : ""}
        leftIcon={<ClipboardIcon />}>
        {copied ? LL.copyToken.copied() : LL.copyToken.copy()}
      </Button>
      {censorable &&
        <Button
          variant="outline"
          onClick={() => toggleIsTokenRevealed()}
          leftIcon={isTokenRevealed ? <EyeClosedIcon /> : <EyeOpenIcon />}>
          {isTokenRevealed ? LL.copyToken.hide() : LL.copyToken.reveal()}
        </Button>}
      {regenerate && <ButtonWithConfirmation
        leftIcon={<UpdateIcon />}
        variant="outline"
        onClick={() => {
          regenerate().catch(() => {
            showNotification({
              title: LL.error(),
              color: "red",
              message: LL.unknownErrorOccurred()
            });
          });
        }}
      >
        {LL.copyToken.regenerate()}
      </ButtonWithConfirmation>}
    </Group>
  </div>;
};
