"use client";
import { useEffect, useState } from "react";
import { CurrentActivityApiResponse } from "../../types";
import { CurrentActivityDisplay } from "./CurrentActivityDisplay";
import { DataCardContainer } from "../DataCard/DataCardContainer";

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
    <DataCardContainer>
      <CurrentActivityDisplay currentActivity={currentActivity} />
    </DataCardContainer>
  );
};
