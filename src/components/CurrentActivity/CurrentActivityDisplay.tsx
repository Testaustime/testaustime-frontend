import { useTranslation } from "react-i18next";
import {
  normalizeProgrammingLanguageName,
  prettifyProgrammingLanguageName,
} from "../../utils/programmingLanguagesUtils";
import { BlinkingDot } from "./BlinkingDot";
import { CurrentActivity } from "./CurrentActivity";
import styles from "./CurrentActivityDisplay.module.css";

type CurrentActivityDisplayProps = {
  currentActivity: CurrentActivity;
};

export const CurrentActivityDisplay = ({
  currentActivity,
}: CurrentActivityDisplayProps) => {
  const { t, i18n } = useTranslation();

  const locale =
    {
      en: "en-US",
      fi: "fi-FI",
    }[i18n.language] ?? "en-US";

  // https://github.com/Testaustime/testaustime-frontend/issues/215
  const utcTime = currentActivity.startedAt.endsWith("Z")
    ? currentActivity.startedAt
    : currentActivity.startedAt + "Z";

  const startedAt = new Date(utcTime).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.container}>
      <BlinkingDot style={{ gridArea: "status", alignSelf: "center" }} />
      <b style={{ gridArea: "title" }}>{currentActivity.projectName}</b>
      <span style={{ gridArea: "language", opacity: 0.6 }}>
        {prettifyProgrammingLanguageName(
          normalizeProgrammingLanguageName(currentActivity.language),
        )}
      </span>
      <span style={{ gridArea: "time", opacity: 0.6 }}>
        {t("dashboard.currentActivity.startedAt", { startedAt })}
      </span>
    </div>
  );
};
