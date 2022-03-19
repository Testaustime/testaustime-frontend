import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { useAuthentication } from "./useAuthentication";

interface ResponseActivityDataEntry {
  language?: string,
  hostname?: string,
  editor_name?: string,
  project_name?: string,
  start_time: string,
  duration: number
}

export type ActivityDataEntry = Omit<ResponseActivityDataEntry, "start_time"> & { start_time: Date, dayStart: Date }

export const useActivityData = () => {
  const { token } = useAuthentication();
  const [entries, setEntries] = useState<ActivityDataEntry[]>([]);

  useEffect(() => {
    fetch("/users/@me/activity/data", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async response => {
      const data: ResponseActivityDataEntry[] = await response.json();
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
