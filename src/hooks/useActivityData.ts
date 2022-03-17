import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { useAuthentication } from "./useAuthentication";

interface ResponseActivityDataEntry {
  "language": string,
  "hostname": string,
  "editor_name": string,
  "project_name": string,
  "start_time": string,
  "duration": number
}

export interface ActivityDataEntry {
  "language": string,
  "hostname": string,
  "editor_name": string,
  "project_name": string,
  "start_time": Date,
  "duration": number
}

export const useActivityData = () => {
  const { token } = useAuthentication();
  const [entries, setEntries] = useState<ActivityDataEntry[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/users/@me/activity/data`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async response => {
      const data: ResponseActivityDataEntry[] = await response.json();
      setEntries(data.map(e => ({
        ...e,
        start_time: new Date(e.start_time)
      })));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return entries;
};
