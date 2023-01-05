import type { BaseTranslation } from "../i18n-types";

/* eslint sort-keys: ["error", "asc"] */
const en: BaseTranslation = {
  copyToken: {
    copied: "Copied!",
    copy: "Copy",
    hide: "Hide",
    regenerate: "Regenerate",
    reveal: "Reveal"
  },
  dashboard: {
    greeting: "Hello, {username:string}!",
    languages: "Languages",
    noData: {
      installPrompt: "<link>Install one of the extensions<link> to begin tracking your programming.",
      title: "No programming activity data to display."
    },
    noProjects: "No projects",
    notLoggedIn: "You are not logged in.",
    projects: "Projects",
    projectsFilter: "Select a project filter",
    statistics: "Your statistics",
    timeFilters: {
      all: "All time",
      month: "Last 30 days",
      week: "Last 7 days"
    },
    timePerDay: "Time per day",
    timePerProject: "Time per project",
    totalTime: "Total time coded in the last {days:number} days: {totalTime:string}"
  },
  extensions: {
    body: "Download the Testaustime extension for your favorite code editor!",
    intellij: "Download Testaustime for IntelliJ",
    micro: "Download Testaustime for Micro",
    neovim: "Download Testaustime for Neovim",
    title: "Extensions",
    vscode: "Download Testaustime for Visual Studio Code"
  },
  footer: {
    authors: {
      core: "Lead developers",
      rest: " and contributors",
      suffix: "By: "
    },
    copyright: "© {year:number} Testausserveri ry & contributors",
    license: "Licensed under the MIT license.",
    source: "Source code",
    supportedBy: "Supported by Testausserveri ry"
  },
  friends: {
    add: "Add",
    addNewFriend: "Add a new friend",
    error: {
      alreadyFriends: "You are already friends with this user.",
      notFound: "User not found.",
      unknownError: "Unknown error."
    },
    friendCode: "Friend code",
    friendCodeInvalid: "Friend code must start with \"ttfc_\", and be followed by 24 alphanumeric characters.",
    friendCodeRequired: "Friend code is required",
    friendDashboardTitle: "Statistics for user {username:string}",
    friendName: "Friend name",
    index: "Index",
    notLoggedIn: "You are not logged in.",
    showDashboard: "View",
    timeCoded: "Time coded during last {days:number} days",
    unfriend: "Unfriend",
    yourFriends: "Your friends"
  },
  leaderboards: {
    admin: "Admin",
    create: "Create",
    createNewLeaderboard: "Create new leaderboard",
    deleteLeaderboard: "Delete leaderboard",
    demote: "Demote",
    inviteCode: "Invite code",
    join: {
      alreadyMember: "You are already a member of this leaderboard",
      genericError: "Error joining leaderboard",
      join: "Join",
      leaderboardCode: "Leaderboard code",
      leaderboardCodeInvalid:
        "Leaderboard code must start with \"ttlic_\", and be followed by 24 alphanumeric characters.",
      leaderboardCodeRequired: "Leaderboard code is required",
      notFound: "Leaderboard not found"
    },
    joinLeaderboard: "Join a leaderboard",
    kick: "Kick",
    leaderboardCreateError: "Error creating leaderboard",
    leaderboardExists: "Leaderboard already exists",
    leaderboards: "Leaderboards",
    leaveLeaderboard: "Leave leaderboard",
    members: "Members",
    name: "Name",
    notLoggedIn: "You are not logged in.",
    position: "Position",
    promote: "Promote",
    seeMore: "See more",
    timeCoded: "Time coded last {days:number} days",
    topMember: "Top member",
    validation: {
      max: "Leaderboard name must be at most {max:number} characters long",
      min: "Leaderboard name must be at least {min:number} characters long",
      regex: "Leaderboard name must only contain alphanumeric characters",
      required: "Leaderboard name is required"
    },
    yourPosition: "Your position"
  },
  navbar: {
    account: "Account",
    dashboard: "Dashboard",
    extensions: "Extensions",
    friends: "Friends",
    leaderboards: "Leaderboards",
    logOut: "Log out",
    login: "Log in",
    register: "Register",
    settings: "Settings"
  },
  profile: {
    authenticationToken: {
      title: "Authentication token",
      tooltip: {
        install: "Get your extension from here!",
        label: "This token is used for authentication in your code editor."
      }
    },
    changePassword: {
      confirm: {
        noMatch: "New passwords must match",
        required: "Password confirmation is required"
      },
      new: {
        invalid: "New password is invalid",
        required: "New password is required",
        tooLong: "Password can not be more than {max:number} characters long",
        tooShort: "Password must be at least {min:number} characters long"
      },
      newPassword: "New password",
      newPasswordConfirm: "Confirm password",
      old: {
        incorrect: "Old password is incorrect",
        required: "Old password is required",
        tooLong: "Password can not be more than {max:number} characters long",
        tooShort: "Password must be at least {min:number} characters long"
      },
      oldPassword: "Old password",
      submit: "Change password",
      success: {
        message: "Your password has been changed successfully.",
        title: "Password changed"
      },
      title: "Change password"
    },
    friendCode: {
      title: "Friend code",
      tooltip: "This code is used for sharing your data with your friends."
    },
    notLoggedIn: "You are not logged in.",
    registrationTime: "Registration time: {registrationTime:string}",
    settings: {
      defaultDayRange: "Default day range",
      language: "Language",
      smoothCharts: "Smooth charts",
      title: "Settings"
    },
    title: "My profile",
    username: "Username: {username:string}"
  },
  prompt: {
    cancel: "Cancel",
    confirmation: "Are you sure?",
    yes: "Yes"
  },
  theme: {
    dark: "Dark mode",
    light: "Light mode",
    toggle: "Toggle color theme"
  }
};

export default en;
