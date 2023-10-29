import { ActionIcon } from "@mantine/core";
import { prettyDuration } from "../../utils/dateUtils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useModals } from "@mantine/modals";
import EditProjectModal from "../EditProjectModal";
import styles from "./ProjectEntry.module.css";

export type ProjectEntryProps = {
  name?: string | undefined | null;
  durationSeconds: number;
  allowEditing?: boolean;
  texts: {
    editProjectTitle: string;
    unknownProject: string;
    editModal: {
      projectName: string;
      save: string;
    };
  };
};

export const ProjectEntry = ({
  name,
  durationSeconds,
  allowEditing,
  texts,
}: ProjectEntryProps) => {
  const modals = useModals();

  const openModal = () => {
    if (name !== undefined && name !== null) {
      const id = modals.openModal({
        title: texts.editProjectTitle.replace("{{PROJECT_NAME}}", name),
        size: "lg",
        children: (
          <EditProjectModal
            projectName={name}
            texts={texts.editModal}
            onClose={() => {
              modals.closeModal(id);
            }}
          />
        ),
        styles: {
          title: {
            fontSize: "2rem",
            marginBlock: "0.5rem",
            fontWeight: "bold",
          },
        },
      });
    }
  };

  return (
    <li>
      <div className={styles.container}>
        <span>
          {name || <i>{texts.unknownProject}</i>}:{" "}
          {prettyDuration(durationSeconds)}
        </span>
        {allowEditing && (
          <ActionIcon
            style={{
              marginInlineStart: 4,
            }}
            size="sm"
            onClick={() => {
              openModal();
            }}
          >
            <Pencil1Icon />
          </ActionIcon>
        )}
      </div>
    </li>
  );
};
