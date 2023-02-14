import { ActionIcon, Title, createStyles } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useModals } from "@mantine/modals";
import EditProjectModal from "../EditProjectModal";
import { useI18nContext } from "../../i18n/i18n-react";

export type ProjectEntryProps = {
  name?: string | undefined | null,
  durationSeconds: number,
  allowEditing?: boolean
}

const useStyles = createStyles(theme => ({
  container: {
    display: "inline-flex",
    gap: theme.spacing.xs,
    alignItems: "center"
  }
}));

export const ProjectEntry = ({ name, durationSeconds, allowEditing }: ProjectEntryProps) => {
  const { classes } = useStyles();
  const modals = useModals();
  const { LL } = useI18nContext();

  const openModal = () => {
    if (name !== undefined && name !== null) {
      const id = modals.openModal({
        title: <Title>{LL.editProject.title({ projectName: name })}</Title>,
        size: "lg",
        children: <EditProjectModal projectName={name} onClose={() => modals.closeModal(id)} />
      });
    }
  };

  return <li>
    <div className={classes.container}>
      <span>{name || <i>{LL.dashboard.unknownProject()}</i>}: {prettyDuration(durationSeconds)}</span>
      {allowEditing && <ActionIcon size="sm" onClick={() => openModal()}>
        <Pencil1Icon />
      </ActionIcon>}
    </div>
  </li>;
};
