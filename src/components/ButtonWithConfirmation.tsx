import { Button, ButtonProps, Popover, Text } from "@mantine/core";
import { FunctionComponent, useState } from "react";

export const ButtonWithConfirmation: FunctionComponent<ButtonProps<"button">> =
  ({ children, onClick, ...otherProps }) => {
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    return <Popover
      opened={confirmationOpen}
      onClose={() => setConfirmationOpen(false)}
      position="bottom"
      placement="center"
      target={<Button {...otherProps} onClick={() => setConfirmationOpen(true)}>{children}</Button>}
    >
      <Text mb={10}>Are you sure?</Text>
      <Button variant="outline" mr={10} onClick={() => setConfirmationOpen(false)}>Cancel</Button>
      <Button variant="filled" color="red" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) { onClick(e); }
        setConfirmationOpen(false);
      }}>Yes</Button>
    </Popover>;
  };