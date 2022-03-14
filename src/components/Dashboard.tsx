import { useActivityData } from "../hooks/useActivityData";
import _ from "lodash";
import { formatDuration, startOfDay } from "date-fns";

const prettifyProgrammingLanguageName = (name: string): string => {
  return {
    "typescript": "TypeScript",
    "typescriptreact": "TypeScript with React"
  }[name] || name;
};

export const Dashboard = () => {
  const entries = useActivityData();

  const entriesWithStartOfDay = entries.map(entry => ({
    ...entry,
    dayStart: startOfDay(entry.start_time)
  }));

  const byDayDictionary = _.groupBy(entriesWithStartOfDay, entry => entry.dayStart.getTime());

  const byDayArray = Object.keys(byDayDictionary).sort((a, b) => Number(b) - Number(a)).map(key => {
    return ({
      date: new Date(Number(key)),
      entries: byDayDictionary[key].sort((a, b) => b.start_time.getTime() - a.start_time.getTime())
    });
  });

  return <div>
    <h2>Your statistics</h2>
    <p>Total time programmed: {formatDuration({ minutes: Math.round(entries.reduce((prev, curr) => prev + curr.duration, 0) / 60) })}</p>
    <h2>Your sessions</h2>
    {byDayArray.map(d => <div key={d.date.getTime()}>
      <h3>{d.date.toLocaleDateString()}</h3>
      {d.entries.map(entry => <div key={entry.start_time.getTime()}>
        {entry.start_time.toLocaleTimeString()}: {entry.project_name} using {prettifyProgrammingLanguageName(entry.language)}
      </div>)}
    </div>)}
  </div>;
};