import type { BaseTranslation } from "../i18n-types";

const en: BaseTranslation = {
  extensions: {
    title: "Extensions",
    body: "Download the Testaustime extension for your favorite code editor!",
    vscode: "Download Testaustime for Visual Studio Code",
    neovim: "Download Testaustime for Neovim",
    intellij: "Download Testaustime for IntelliJ",
    micro: "Download Testaustime for Micro"
  },
  footer: {
    supportedBy: "Supported by Testausserveri ry",
    authors: {
      label: "Authors",
      and: "and"
    },
    copyright: "© {year:number} Testausserveri ry & contributors",
    license: "Licensed under the MIT license.",
    source: "Source code"
  },
  prompt: {
    confirmation: "Are you sure?",
    yes: "Yes",
    cancel: "Cancel"
  },
  navbar: {
    dashboard: "Dashboard",
    friends: "Friends",
    leaderboards: "Leaderboards",
    account: "Account",
    settings: "Settings",
    extensions: "Extensions",
    logOut: "Log out",
    login: "Log in",
    register: "Register"
  },
  theme: {
    light: "Light mode",
    dark: "Dark mode",
    toggle: "Toggle color theme"
  },
  dashboard: {
    greeting: "Hello, {username:string}!",
    statistics: "Your statistics",
    notLoggedIn: "You are not logged in.",
    projects: "Projects",
    noProjects: "No projects",
    projectsFilter: "Select a project filter",
    timeFilters: {
      week: "Last 7 days",
      month: "Last 30 days",
      all: "All time"
    },
    timePerDay: "Time per day",
    totalTime: "Total time coded in the last {days:number} days: {totalTime:string}",
    timePerProject: "Time per project",
    languages: "Languages",
    noData: {
      title: "No programming activity data to display.",
      installPrompt: "<link>Install one of the extensions<link> to begin tracking your programming."
    }
  }
};

export default en;
