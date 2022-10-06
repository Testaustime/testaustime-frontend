import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { FunctionComponent } from "react";

export interface WithTooltipProps {
  tooltipLabel: React.ReactNode
}

export const WithTooltip: FunctionComponent<WithTooltipProps> = ({ tooltipLabel, children }) => {
  return <Group spacing={10}>
    {children}
    <Tooltip
      multiline
      width={250}
      withArrow
      closeDelay={300}
      label={tooltipLabel}
      sx={{
        pointerEvents: "all"
      }}
    >
      <ActionIcon size={30}>
        <QuestionMarkCircledIcon width={20} height={20} />
      </ActionIcon>
    </Tooltip>
  </Group>;
};
