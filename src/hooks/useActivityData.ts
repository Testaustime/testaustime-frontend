import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../config";
import { RootState } from "../store";

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
  const token = useSelector<RootState, string>(state => state.users.authToken);
  const [entries, setEntries] = useState<ActivityDataEntry[]>([]);

  useEffect(() => {
    axiosInstance.get<ResponseActivityDataEntry[]>("/activity/data", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setEntries(response.data.map(e => ({
        ...e,
        start_time: new Date(e.start_time)
      })));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return entries;
};