import { Button, Group, Popover, Text } from "@mantine/core";
import { useBooleanToggle, useClipboard } from "@mantine/hooks";
import { ClipboardIcon, EyeClosedIcon, EyeOpenIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { handleErrorWithNotification } from "../../utils/notificationErrorHandler";
import Censorable from "../Censorable";

export interface TokenFieldProps {
  value: string,
  regenerate: () => Promise<string>,
  censorable?: boolean,
  revealLength?: number
}

export const TokenField = ({ value, regenerate, censorable, revealLength }: TokenFieldProps) => {
  const { copy, copied, reset } = useClipboard({ timeout: 2000 });
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isTokenRevealed, toggleIsTokenRevealed] = useBooleanToggle(false);

  useEffect(() => {
    return reset;
  }, []);

  return <div>
    {censorable ?
      <Text><Censorable authToken={value} revealLength={revealLength || 0} revealed={isTokenRevealed} /></Text> :
      <Text><code>{value}</code></Text>}
    <Group spacing={15} mt={25}>
      <Button variant="filled" onClick={() => copy(value)} color={copied ? "green" : ""} leftIcon={<ClipboardIcon />}>{copied ? "Copied!" : "Copy"}</Button>
      {censorable && <Button variant="outline" onClick={() => toggleIsTokenRevealed()} leftIcon={isTokenRevealed ? <EyeClosedIcon /> : <EyeOpenIcon />}>{isTokenRevealed ? "Hide" : "Reveal"}</Button>}
      <Popover
        opened={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        position="bottom"
        placement="center"
        target={<Button variant="outline" onClick={() => setConfirmationOpen(true)} leftIcon={<UpdateIcon />}>Regenerate</Button>}
      >
        <Text mb={10}>Are you sure?</Text>
        <Button variant="outline" mr={10} onClick={() => setConfirmationOpen(false)}>Cancel</Button>
        <Button variant="filled" color="red" onClick={() => {
          regenerate().catch(handleErrorWithNotification);
          setConfirmationOpen(false);
        }}>Yes</Button>
      </Popover>
    </Group>
  </div>;
};