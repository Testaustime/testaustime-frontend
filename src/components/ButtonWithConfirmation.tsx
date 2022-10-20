import { Button, ButtonProps, Popover, Text } from "@mantine/core";
import { FunctionComponent, useState } from "react";
import { useI18nContext } from "../i18n/i18n-react";

export const ButtonWithConfirmation: FunctionComponent<ButtonProps
  & { onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined }> =
  ({ children, onClick, ...otherProps }) => {
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const { LL } = useI18nContext();

    return <Popover
      opened={confirmationOpen}
      onClose={() => setConfirmationOpen(false)}
      position="bottom"
    >
      <Popover.Target>
        <Button {...otherProps} onClick={() => setConfirmationOpen(true)}>{children}</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text mb={10}>{LL.prompt.confirmation()}</Text>
        <Button variant="outline" mr={10} onClick={() => setConfirmationOpen(false)}>{LL.prompt.cancel()}</Button>
        <Button variant="filled" color="red" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (onClick) { onClick(e); }
          setConfirmationOpen(false);
        }}>{LL.prompt.yes()}</Button>
      </Popover.Dropdown>
    </Popover>;
  };
