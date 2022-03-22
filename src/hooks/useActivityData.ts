import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import useAuthentication from "./UseAuthentication";

export interface ApiUsersUserActivityDataResponseItem {
  id: number,
  start_time: string,
  duration: number,
  project_name?: string,
  language?: string,
  editor_name?: string,
  hostname?: string,
}

export type ActivityDataEntry = Omit<ApiUsersUserActivityDataResponseItem, "start_time"> & {
  start_time: Date,
  dayStart: Date
}

export const useActivityData = () => {
  const { token } = useAuthentication();
  const [entries, setEntries] = useState<ActivityDataEntry[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/users/@me/activity/data`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async response => {
      const data: ApiUsersUserActivityDataResponseItem[] = await response.json();
      setEntries(data.map(e => ({
        ...e,
        start_time: new Date(e.start_time),
        dayStart: startOfDay(new Date(e.start_time))
      })));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return entries;
};
