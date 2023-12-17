"use client";
import { DataCardContainer } from "../DataCard/DataCardContainer";
import { BlinkingDot } from "./BlinkingDot";
import styles from "./CurrentActivity.module.css";
import { useTranslation } from "react-i18next";
import {
  normalizeProgrammingLanguageName,
  prettifyProgrammingLanguageName,
} from "../../utils/programmingLanguagesUtils";
import { useEffect, useState } from "react";
import { CurrentActivityApiResponse } from "../../types";

export type CurrentActivity = {
  projectName: string;
  language: string;
  startedAt: string;
};

type CurrentActivityProps = {
  initialActivity: CurrentActivity;
  username: string;
};

export const CurrentActivity = (props: CurrentActivityProps) => {
  const [currentActivity, setCurrentActivity] = useState<CurrentActivity>(
    props.initialActivity,
  );

  const { t } = useTranslation();

  const { i18n } = useTranslation();
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

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/activity-status/${props.username}`, {
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((data: CurrentActivityApiResponse) => {
          setCurrentActivity({
            language: data.heartbeat.language,
            projectName: data.heartbeat.project_name,
            startedAt: data.started,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [props.username]);

  return (
    <DataCardContainer className={styles.container}>
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
    </DataCardContainer>
  );
};
