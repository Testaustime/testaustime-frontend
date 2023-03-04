import { ActionIcon, Title, createStyles } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useModals } from "@mantine/modals";
import EditProjectModal from "../EditProjectModal";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const openModal = () => {
    if (name !== undefined && name !== null) {
      const id = modals.openModal({
        title: <Title>{t("editProject.title", { projectName: name })}</Title>,
        size: "lg",
        children: <EditProjectModal projectName={name} onClose={() => modals.closeModal(id)} />
      });
    }
  };

  return <li>
    <div className={classes.container}>
      <span>{name || <i>{t("dashboard.unknownProject")}</i>}: {prettyDuration(durationSeconds)}</span>
      {allowEditing && <ActionIcon size="sm" onClick={() => openModal()}>
        <Pencil1Icon />
      </ActionIcon>}
    </div>
  </li>;
};
