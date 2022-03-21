import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import { Text, Title } from "@mantine/core";
import useAuthentication from "../hooks/UseAuthentication";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import TopLanguages from "./TopLanguages";
import { prettyDuration } from "../utils/dateUtils";
import { TopProjects } from "./TopProjects/TopProjects";
import DaySessions from "./DaySessions";
import { groupBy, sumBy } from "../utils/arrayUtils";

const getAllEntriesByDay = (entries: ActivityDataEntry[]): { date: Date, entries: ActivityDataEntry[] }[] => {
  const byDayDictionary = groupBy(entries, entry => entry.dayStart.getTime());
  return Object.keys(byDayDictionary).sort((a, b) => Number(b) - Number(a)).map(key => ({
    date: new Date(Number(key)),
    entries: byDayDictionary[key].sort((a, b) => b.start_time.getTime() - a.start_time.getTime())
  }));
};

export const Dashboard = () => {
  const { isLoggedIn } = useAuthentication();
  const navigate = useNavigate();

  const entries = useActivityData().map(entry => ({
    ...entry,
    language: normalizeProgrammingLanguageName(entry.language),
  }));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  if (!isLoggedIn) return <Text>You need to log in to view this page</Text>;

  return <div>
    <Title mb={5}>Your statistics</Title>
    <Text>Total time programmed: {prettyDuration(sumBy(entries, entry => entry.duration))}</Text>
    <Title order={2} mt={20} mb={5}>Languages</Title>
    <TopLanguages entries={entries} />
    <Title order={2} mt={20} mb={5}>Projects</Title>
    <TopProjects entries={entries} />
    <Title order={2} mt={20} mb={5}>Your sessions</Title>
    {getAllEntriesByDay(entries).map(d => <DaySessions key={d.date.getTime()} date={d.date} entries={d.entries} />)}
  </div>;
};
