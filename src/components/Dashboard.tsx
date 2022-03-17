import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import _ from "lodash";
import { formatDuration, startOfDay, intervalToDuration } from "date-fns";
import { Text, Title } from "@mantine/core";
import { useAuthentication } from "../hooks/useAuthentication";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const prettifyProgrammingLanguageName = (name: string): string => ({
  "typescript": "TypeScript",
  "typescriptreact": "TypeScript with React",
  "json": "JSON",
  "html": "HTML",
  "css": "CSS"
}[name] || name);

type ActivityDataEntryWithDate = ActivityDataEntry & { dayStart: Date };

const getAllTimeTopLanguages = (entries: ActivityDataEntryWithDate[]): { language: string, totalSeconds: number }[] => {
  const byLanguage = _.groupBy(entries, entry => entry.language);
  return Object.keys(byLanguage).map(language => ({
    language,
    totalSeconds: byLanguage[language].reduce((prev, curr) => prev + curr.duration, 0)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

const getAllTimeTopProjects = (entries: ActivityDataEntryWithDate[]): { project: string, totalSeconds: number }[] => {
  const byProject = _.groupBy(entries, entry => entry.project_name);
  return Object.keys(byProject).map(project => ({
    project,
    totalSeconds: byProject[project].reduce((prev, curr) => prev + curr.duration, 0)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

const getAllEntriesByDay = (entries: ActivityDataEntryWithDate[]): { date: Date, entries: ActivityDataEntry[] }[] => {
  const byDayDictionary = _.groupBy(entries, entry => entry.dayStart.getTime());
  return Object.keys(byDayDictionary).sort((a, b) => Number(b) - Number(a)).map(key => ({
    date: new Date(Number(key)),
    entries: byDayDictionary[key].sort((a, b) => b.start_time.getTime() - a.start_time.getTime())
  }));
};

export const Dashboard = () => {
  const entries = useActivityData();
  const { isLoggedIn } = useAuthentication();
  const navigate = useNavigate();

  const entriesWithStartOfDay = entries.map(entry => ({
    ...entry,
    dayStart: startOfDay(entry.start_time)
  }));


  const formatShort = {
    xSeconds: "{{count}}s",
    xMinutes: "{{count}}min",
    xHours: "{{count}}h"
  };

  const prettyDuration = (seconds: number) => formatDuration(intervalToDuration({ start: 0, end: Math.round(seconds * 1000 / 60000) * 60000 }),
    {
      locale: {
        // Let's just hope the token is one of these options
        formatDistance: (token: "xSeconds" | "xMinutes" | "xHours", count: number) => formatShort[token].replace("{{count}}", String(count))
      }
    }) || "0 seconds";

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  if (!isLoggedIn) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title>Your statistics</Title>
    <p>Total time programmed: {prettyDuration(entries.reduce((prev, curr) => prev + curr.duration, 0))}</p>
    <Title order={2}>Languages</Title>
    <ol>
      {getAllTimeTopLanguages(entriesWithStartOfDay).map(l => <li key={l.language}>
        {prettifyProgrammingLanguageName(l.language)}: {prettyDuration(l.totalSeconds)}
      </li>)}
    </ol>
    <Title order={2}>Projects</Title>
    <ol>
      {getAllTimeTopProjects(entriesWithStartOfDay).map(p => <li key={p.project}>
        {p.project}: {prettyDuration(p.totalSeconds)}
      </li>)}
    </ol>
    <Title order={2}>Your sessions</Title>
    {getAllEntriesByDay(entriesWithStartOfDay).map(d => <div key={d.date.getTime()}>
      <Title order={3}>{d.date.toLocaleDateString()}</Title>
      <p>
        Time today: {prettyDuration(d.entries.reduce((prev, curr) => prev + curr.duration, 0))}
      </p>
      <ol>
        {d.entries.map(entry => <li key={entry.start_time.getTime()}>
          {entry.start_time.toLocaleTimeString()}: {entry.project_name} using {prettifyProgrammingLanguageName(entry.language)}
        </li>)}
      </ol>
    </div>)}
  </div>;
};