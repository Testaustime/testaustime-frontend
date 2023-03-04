import { Button, ButtonProps, Popover, Text } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "next-i18next";
export type ButtonWithConfirmationProps =
  ButtonProps & { onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined }

export const ButtonWithConfirmation = ({ children, onClick, ...otherProps }: ButtonWithConfirmationProps) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const { t } = useTranslation();

  return <Popover
    opened={confirmationOpen}
    onClose={() => setConfirmationOpen(false)}
    position="bottom"
  >
    <Popover.Target>
      <Button {...otherProps} onClick={() => setConfirmationOpen(true)}>{children}</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text mb={10}>{t("prompt.confirmation")}</Text>
      <Button variant="outline" mr={10} onClick={() => setConfirmationOpen(false)}>{t("prompt.cancel")}</Button>
      <Button variant="filled" color="red" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) { onClick(e); }
        setConfirmationOpen(false);
      }}>{t("prompt.yes")}</Button>
    </Popover.Dropdown>
  </Popover>;
};
