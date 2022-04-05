import axios from "axios";
import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import useAuthentication from "./UseAuthentication";

interface ApiUsersUserActivityDataResponseItem {
  id: number,
  start_time: string,
  duration: number,
  project_name?: string | null,
  language?: string,
  editor_name?: string,
  hostname?: string,
}

export type ActivityDataEntry = Omit<ApiUsersUserActivityDataResponseItem, "start_time" | "project_name"> & {
  start_time: Date,
  dayStart: Date,
  project_name?: string
}

export const useActivityData = () => {
  const { token } = useAuthentication();
  const [entries, setEntries] = useState<ActivityDataEntry[]>([]);

  useEffect(() => {
    axios.get<ApiUsersUserActivityDataResponseItem[]>("/users/@me/activity/data", { headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => {
      setEntries(data.map(e => ({
        ...e,
        start_time: new Date(e.start_time),
        dayStart: startOfDay(new Date(e.start_time)),
        project_name: e.project_name || undefined, // Change nulls and empty strings to undefineds
      })));
    });
  }, []);

  return entries;
};
