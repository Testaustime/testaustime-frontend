import { ActionIcon } from "@mantine/core";
import { prettyDuration, TimeUnit } from "../../utils/dateUtils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useModals } from "@mantine/modals";
import EditProjectModal from "../EditProjectModal";
import styles from "./ProjectEntry.module.css";
import { useTranslation } from "react-i18next";

type ProjectEntryProps = {
  name?: string | undefined | null;
  durationSeconds: number;
  allowEditing?: boolean;
  maxTimeUnit: TimeUnit;
};

export const ProjectEntry = ({
  name,
  durationSeconds,
  allowEditing,
  maxTimeUnit,
}: ProjectEntryProps) => {
  const modals = useModals();

  const { t } = useTranslation();

  const openModal = () => {
    if (name !== undefined && name !== null) {
      const id = modals.openModal({
        title: t("editProject.title", { projectName: name }),
        size: "lg",
        children: (
          <EditProjectModal
            projectName={name}
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
          {name || <i>{t("dashboard.unknownProject")}</i>}:{" "}
          {prettyDuration(durationSeconds, maxTimeUnit)}
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
