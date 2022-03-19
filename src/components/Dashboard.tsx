import { ActivityDataEntry, useActivityData } from "../hooks/useActivityData";
import _ from "lodash";
import { formatDuration, intervalToDuration } from "date-fns";
import { List, Text, Title } from "@mantine/core";
import { useAuthentication } from "../hooks/useAuthentication";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const isStringNull = (text: string | null | undefined) => !text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined" || text.trim() === "";
const capitalizeFirstLetter = (text: string) => text[0].toUpperCase() + text.slice(1);

const normalizeProgrammingLanguageName = (name?: string) => {
  if (!name || isStringNull(name)) return undefined;

  // Create "synonyms" for the programming language names. The values will be used to get the language's name in `prettifyProgrammingLanguageName`
  return {
    "cs": "csharp",
    "ts": "typescript",
    "tsx": "typescriptreact",
    "js": "javascript",
    "jsx": "javascriptreact",
    "perl6": "perl",
    "jade": "pug",
    "gitcommit": "git-commit",
    "gitrebase": "git-rebase",
    "shellscript": "sh",
    "make": "makefile"
  }[name] || name;
};

const prettifyProgrammingLanguageName = (name?: string) => {
  if (!name || isStringNull(name)) return undefined;

  return ({
    "typescript": "TypeScript",
    "typescriptreact": "TypeScript with React",
    "javascript": "JavaScript",
    "json": "JSON",
    "html": "HTML",
    "css": "CSS",
    "rust": "Rust",
    "vimwiki": "VimWiki",
    "abap": "ABAP",
    "bat": "Windows Batch",
    "bibtex": "BibTeX",
    "coffeescript": "CoffeeScript",
    "cpp": "C++",
    "csharp": "C#",
    "cuda-cpp": "CUDA C++",
    "fsharp": "F#",
    "git-commit": "Git Commit",
    "git-rebase": "Git Rebase",
    "jsonc": "JSON with Comments",
    "latex": "LaTeX",
    "objective-c": "Objective-C",
    "objective-cpp": "Objective-C++",
    "php": "PHP",
    "plaintext": "Plain Text",
    "powershell": "PowerShell",
    "scss": "SCSS",
    "sass": "SASS",
    "shaderlab": "ShaderLab",
    "sh": "Shell Script",
    "sql": "SQL",
    "text": "TeX",
    "vb": "Visual Basic",
    "vue-html": "Vue HTML",
    "xml": "XML",
    "xsl": "XSL",
    "yaml": "YAML",
    "toml": "TOML",
    "cabalconfig": "Cabal Config",
    "zsh": "ZSH",
    "nginx": "NGINX",
    "sshconfig": "SSH Config",
    "conf": "Config",
  }[name] || capitalizeFirstLetter(name));
};

const getAllTimeTopLanguages = (entries: ActivityDataEntry[]): { language?: string, totalSeconds: number }[] => {
  const byLanguage = _.groupBy(entries, entry => entry.language);
  return Object.keys(byLanguage).map(language => ({
    language: isStringNull(language) ? undefined : language,
    totalSeconds: byLanguage[language].reduce((prev, curr) => prev + curr.duration, 0)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

const getAllTimeTopProjects = (entries: ActivityDataEntry[]): { project_name?: string, totalSeconds: number }[] => {
  const byProject = _.groupBy(entries, entry => entry.project_name);
  return Object.keys(byProject).map(project => ({
    project_name: isStringNull(project) ? undefined : project,
    totalSeconds: byProject[project].reduce((prev, curr) => prev + curr.duration, 0)
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
};

const getAllEntriesByDay = (entries: ActivityDataEntry[]): { date: Date, entries: ActivityDataEntry[] }[] => {
  const byDayDictionary = _.groupBy(entries, entry => entry.dayStart.getTime());
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
    <Title mb={5}>Your statistics</Title>
    <Text>Total time programmed: {prettyDuration(entries.reduce((prev, curr) => prev + curr.duration, 0))}</Text>
    <Title order={2} mt={20} mb={5}>Languages</Title>
    <List type="ordered" withPadding>
      {getAllTimeTopLanguages(entries).map(l => <List.Item key={l.language || "null"}>
        {prettifyProgrammingLanguageName(l.language) || <i>Unknown</i>}: {prettyDuration(l.totalSeconds)}
      </List.Item>)}
    </List>
    <Title order={2} mt={20} mb={5}>Projects</Title>
    <List type="ordered" withPadding>
      {getAllTimeTopProjects(entries).map(p => <List.Item key={p.project_name || "null"}>
        {p.project_name || <i>Unknown</i>}: {prettyDuration(p.totalSeconds)}
      </List.Item>)}
    </List>
    <Title order={2} mt={20} mb={5}>Your sessions</Title>
    {getAllEntriesByDay(entries).map(d => <div key={d.date.getTime()}>
      <Title order={3} mt={15} mb={5}>{d.date.toLocaleDateString()}</Title>
      <Text>Time coded: {prettyDuration(d.entries.reduce((prev, curr) => prev + curr.duration, 0))}</Text>
      <List withPadding>
        {d.entries.map(entry => <List.Item key={entry.start_time.getTime()}>
          {entry.start_time.toLocaleTimeString()}: {entry.project_name || <i>Unknown</i>} using {prettifyProgrammingLanguageName(entry.language) || <i>Unknown</i>}
        </List.Item>)}
      </List>
    </div>)}
  </div>;
};
