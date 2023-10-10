import { Group, Tooltip } from "@mantine/core";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";

export type WithTooltipProps = PropsWithChildren<{
  tooltipLabel: React.ReactNode;
}>;

export const WithTooltip = ({ tooltipLabel, children }: WithTooltipProps) => {
  return (
    <Group gap={10}>
      {children}
      <Tooltip
        multiline
        w={250}
        withArrow
        closeDelay={300}
        label={tooltipLabel}
        style={{
          pointerEvents: "all",
        }}
      >
        <QuestionMarkCircledIcon width={20} height={20} />
      </Tooltip>
    </Group>
  );
};
