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
  },
  profile: {
    title: "My profile",
    username: "Username: {username:string}",
    registrationTime: "Registration time: {registrationTime:string}",
    notLoggedIn: "You are not logged in.",
    authenticationToken: {
      title: "Authentication token",
      tooltip: {
        label: "This token is used for authentication in your code editor.",
        install: "Get your extension from here!"
      }
    },
    friendCode: {
      title: "Friend code",
      tooltip: "This code is used for sharing your data with your friends."
    },
    settings: {
      title: "Settings",
      smoothCharts: "Smooth charts"
    }
  },
  copyToken: {
    copy: "Copy",
    copied: "Copied!",
    hide: "Hide",
    reveal: "Reveal",
    regenerate: "Regenerate"
  },
  friends: {
    notLoggedIn: "You are not logged in.",
    addNewFriend: "Add a new friend",
    friendCodeRequired: "Friend code is required",
    friendCodeInvalid: "Friend code must start with \"ttfc_\", and be followed by 24 alphanumeric characters.",
    friendCode: "Friend code",
    add: "Add",
    yourFriends: "Your friends",
    index: "Index",
    friendName: "Friend name",
    timeCoded: "Time coded during last {days:number} days",
    unfriend: "Unfriend"
  },
  leaderboards: {
    createNewLeaderboard: "Create new leaderboard",
    joinLeaderboard: "Join a leaderboard",
    notLoggedIn: "You are not logged in.",
    leaderboards: "Leaderboards",
    name: "Name",
    topMember: "Top member",
    yourPosition: "Your position",
    admin: "Admin",
    seeMore: "See more",
    leaveLeaderboard: "Leave leaderboard",
    deleteLeaderboard: "Delete leaderboard",
    members: "Members",
    position: "Position",
    timeCoded: "Time coded last {days:number} days",
    kick: "Kick",
    demote: "Demote",
    promote: "Promote",
    inviteCode: "Invite code",
    leaderboardExists: "Leaderboard already exists",
    leaderboardCreateError: "Error creating leaderboard",
    validation: {
      required: "Leaderboard name is required",
      min: "Leaderboard name must be at least {min:number} characters long",
      max: "Leaderboard name must be at most {max:number} characters long",
      regex: "Leaderboard name must only contain alphanumeric characters"
    },
    create: "Create",
    join: {
      leaderboardCodeRequired: "Leaderboard code is required",
      leaderboardCodeInvalid:
        "Leaderboard code must start with \"ttlic_\", and be followed by 24 alphanumeric characters.",
      alreadyMember: "You are already a member of this leaderboard",
      genericError: "Error joining leaderboard",
      leaderboardCode: "Leaderboard code",
      join: "Join"
    }
  }
};

export default en;
