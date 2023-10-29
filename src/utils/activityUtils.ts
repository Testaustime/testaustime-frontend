import { startOfDay } from "date-fns";
import { DayRange, getDayCount } from "./dateUtils";
import { ActivityDataEntry } from "../types";

export const filterEntries = (
  entries: ActivityDataEntry[],
  filter: {
    projectFilter?: string[];
    dayFilter: DayRange;
  },
) => {
  const timeFilteredEntries = entries.filter((e) => {
    if (filter.dayFilter === "all") {
      return true;
    }
    const dayCount = getDayCount(filter.dayFilter);
    const dayStart = startOfDay(e.start_time);
    return (
      new Date().getTime() - dayStart.getTime() <=
      dayCount * 24 * 60 * 60 * 1000
    );
  });

  const filteredEntries = timeFilteredEntries.filter((e) =>
    filter.projectFilter
      ? e.project_name && filter.projectFilter.includes(e.project_name)
      : true,
  );

  const unfilteredProjectNames = [
    ...new Set(
      timeFilteredEntries
        .map((e) => e.project_name || "Unknown")
        .filter((e) => e),
    ),
  ];

  return {
    entries: filteredEntries,
    unfilteredProjectNames,
  };
};
