import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import { Text, Title } from "@mantine/core";
import { YAxis, XAxis, CartesianGrid, Tooltip,  Line, LineChart } from "recharts";
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
  const entries = useActivityData().map(entry => ({
    ...entry,
    language: normalizeProgrammingLanguageName(entry.language),
  }));

  const data_ig = getAllEntriesByDay(entries).map(e => ({date: e.date.toDateString(), duration: sumBy(e.entries, entry => entry.duration)}));

  return <div>
    <Title mb={5}>Your statistics</Title>
    <LineChart width={500} height={300} data={data_ig}>
      <XAxis dataKey="date" reversed={true} padding={{left: 10}}/>
      <YAxis dataKey="duration" padding={{bottom: 10}} type="number" tickFormatter={d => {
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const hDisplay = h > 0 ? h + "h " : "";
        const mDisplay = m > 0 ? m + "m " : "";
        return hDisplay + mDisplay;
      }}/>
      <Tooltip/>
      <CartesianGrid/>
      <Line dataKey="duration" strokeWidth={3}></Line>
    </LineChart>
    <Text>Total time programmed: {prettyDuration(sumBy(entries, entry => entry.duration))}</Text>
    <Title order={2} mt={20} mb={5}>Languages</Title>
    <TopLanguages entries={entries} />
    <Title order={2} mt={20} mb={5}>Projects</Title>
    <TopProjects entries={entries} />
    <Title order={2} mt={20} mb={5}>Your sessions</Title>
    {getAllEntriesByDay(entries).map(d => <DaySessions key={d.date.getTime()} date={d.date} entries={d.entries} />)}
  </div>;
};
