import { useActivityData } from "../hooks/useActivityData";
import _ from "lodash";
import { formatDuration, startOfDay } from "date-fns";

const prettifyProgrammingLanguageName = (name: string): string => ({
  "typescript": "TypeScript",
  "typescriptreact": "TypeScript with React",
  "json": "JSON",
  "html": "HTML"
}[name] || name);

export const Dashboard = () => {
  const entries = useActivityData();

  // Group by date
  const entriesWithStartOfDay = entries.map(entry => ({
    ...entry,
    dayStart: startOfDay(entry.start_time)
  }));
  const byDayDictionary = _.groupBy(entriesWithStartOfDay, entry => entry.dayStart.getTime());
  const byDayArray = Object.keys(byDayDictionary).sort((a, b) => Number(b) - Number(a)).map(key => ({
    date: new Date(Number(key)),
    entries: byDayDictionary[key].sort((a, b) => b.start_time.getTime() - a.start_time.getTime())
  }));

  // Group by programming language
  const entriesByProgrammingLanguage = _.groupBy(entries, entry => entry.language);
  const programmingLanguagesSorted = Object.keys(entriesByProgrammingLanguage)
    .map(language => ({
      totalSeconds: entriesByProgrammingLanguage[language].reduce((prev, curr) => prev + curr.duration, 0),
      language
    }))
    .sort(l => -l.totalSeconds);

  const getEntriesForDate = (date: Date) => {
    return byDayDictionary[date.getTime()];
  };

  const byProject = _.groupBy(entries, entry => entry.project_name);
  const projectsSorted = Object.keys(byProject)
    .map(project => ({
      totalSeconds: byProject[project].reduce((prev, curr) => prev + curr.duration, 0),
      project
    }))
    .sort(p => -p.totalSeconds);

  return <div>
    <h2>Your statistics</h2>
    <p>Total time programmed: {formatDuration({ minutes: Math.round(entries.reduce((prev, curr) => prev + curr.duration, 0) / 60) })}</p>
    <h3>Languages</h3>
    <ol>
      {programmingLanguagesSorted.map(l => <li key={l.language}>
        {prettifyProgrammingLanguageName(l.language)}: {formatDuration({ minutes: Math.round(l.totalSeconds / 60) }, { zero: true })}
      </li>)}
    </ol>
    <h3>Projects</h3>
    <ol>
      {projectsSorted.map(p => <li key={p.project}>
        {p.project}: {formatDuration({ minutes: Math.round(p.totalSeconds / 60) }, { zero: true })}
      </li>)}
    </ol>
    <h2>Your sessions</h2>
    {byDayArray.map(d => <div key={d.date.getTime()}>
      <h3>{d.date.toLocaleDateString()}</h3>
      <p>
        Time today: {formatDuration({ minutes: Math.round(getEntriesForDate(d.date).reduce((prev, curr) => prev + curr.duration, 0) / 60) }, { zero: true })}
      </p>
      <ol>
        {d.entries.map(entry => <li key={entry.start_time.getTime()}>
          {entry.start_time.toLocaleTimeString()}: {entry.project_name} using {prettifyProgrammingLanguageName(entry.language)}
        </li>)}
      </ol>
    </div>)}
  </div>;
};