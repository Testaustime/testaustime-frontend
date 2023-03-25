import axios from "axios";
import { startOfDay } from "date-fns";
import { DayRange, getDayCount } from "../utils/dateUtils";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import { useQuery } from "@tanstack/react-query";

export interface ApiUsersUserActivityDataResponseItem {
  id: number,
  start_time: string,
  duration: number,
  project_name?: string | null,
  language?: string,
  editor_name?: string,
  hostname?: string
}

export type ActivityDataEntry = Omit<ApiUsersUserActivityDataResponseItem, "start_time" | "project_name"> & {
  start_time: Date,
  dayStart: Date,
  project_name?: string
}

export const useActivityData = (username: string, filter: {
  projectFilter?: string[],
  dayFilter: DayRange
}) => {
  const { data: entries } = useQuery(["activityData", username], async () => {
    const response = await axios.get<ApiUsersUserActivityDataResponseItem[]>(`/users/${username}/activity/data`);
    const mappedData: ActivityDataEntry[] = response.data.map(e => ({
      ...e,
      start_time: new Date(e.start_time),
      dayStart: startOfDay(new Date(e.start_time)),
      project_name: e.project_name || undefined,
      language: normalizeProgrammingLanguageName(e.language)
    }));

    return mappedData;
  }, {
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  return (entries ?? [])
    .filter(e => filter.projectFilter ? e.project_name && filter.projectFilter.includes(e.project_name) : true)
    .filter(e => {
      if (filter.dayFilter === "all") {
        return true;
      }
      const dayCount = getDayCount(filter.dayFilter);
      const dayStart = startOfDay(e.start_time);
      return new Date().getTime() - dayStart.getTime() <= dayCount * 24 * 60 * 60 * 1000;
    });
};
