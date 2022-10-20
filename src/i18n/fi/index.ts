import type { Translation } from "../i18n-types";

const fi: Translation = {
  extensions: {
    title: "Laajennukset",
    body: "Lataa Testaustime-laajennus suosikkieditorillesi!",
    vscode: "Lataa Testaustime Visual Studio Code:lle",
    neovim: "Lataa Testaustime Neovim:lle",
    intellij: "Lataa Testaustime IntelliJ:lle",
    micro: "Lataa Testaustime Micro:lle"
  },
  footer: {
    authors: {
      label: "Kehittäjät",
      and: "ja"
    },
    copyright: "© {year} Testausserveri ry & muut",
    license: "Lisensoitu MIT-lisenssillä.",
    source: "Lähdekoodi",
    supportedBy: "Testausserveri ry:n tukema"
  },
  prompt: {
    confirmation: "Oletko varma?",
    yes: "Kyllä",
    cancel: "Peruuta"
  },
  navbar: {
    account: "Tili",
    dashboard: "Etusivu",
    friends: "Kaverit",
    leaderboards: "Tulostaulut",
    logOut: "Kirjaudu ulos",
    login: "Kirjaudu sisään",
    register: "Rekisteröidy",
    settings: "Asetukset",
    extensions: "Laajennukset"
  },
  theme: {
    dark: "Tumma teema",
    light: "Vaalea teema",
    toggle: "Vaihda väriteemaa"
  },
  dashboard: {
    greeting: "Hei, {username}!",
    languages: "Kielet",
    noData: {
      title: "Ei näytettävää tietoa.",
      installPrompt: "<link>Asenna Testaustime-laajennus<link>, jotta voit nähdä tietoja."
    },
    noProjects: "Ei projekteja",
    notLoggedIn: "Et ole kirjautunut sisään.",
    projects: "Projektit",
    projectsFilter: "Valitse projektit",
    statistics: "Tilastosi",
    timeFilters: {
      all: "Aina",
      month: "Viimeiset 30 päivää",
      week: "Viimeiset 7 päivää"
    },
    timePerDay: "Aika per päivä",
    timePerProject: "Aika per projekti",
    totalTime: "Kokonaika viimeisten {days} päivän aikana: {totalTime}"
  }
};

export default fi;
