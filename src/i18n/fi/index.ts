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
    totalTime: "Kokonaisaika viimeisten {days} päivän aikana: {totalTime}"
  },
  profile: {
    title: "Profiili",
    username: "Käyttäjänimi: {username}",
    authenticationToken: {
      title: "Tunnistautumistunnus",
      tooltip: {
        label: "Tätä tunnusta käytetään tunnistautumiseen koodieditorissasi.",
        install: "Asenna Testaustime-laajennus täältä!"
      }
    },
    friendCode: {
      title: "Kaverikoodi",
      tooltip: "Tätä koodia käytetään, kun haluat jakaa dataa kavereillesi."
    },
    notLoggedIn: "Et ole kirjautunut sisään.",
    registrationTime: "Rekisteröitymisaika: {registrationTime}",
    settings: {
      title: "Asetukset",
      smoothCharts: "Pehmeät kaaviot"
    }
  },
  copyToken: {
    copy: "Kopioi",
    copied: "Kopioitu!",
    hide: "Piilota",
    reveal: "Näytä",
    regenerate: "Generoi uudelleen"
  },
  friends: {
    add: "Lisää",
    addNewFriend: "Lisää uusi kaveri",
    friendCode: "Kaverikoodi",
    friendCodeInvalid: "Kaverikoodin tulee alkaa \"ttfc_\", ja sen jälkeen täytyy olla 24 alphanumeerista kirjainta.",
    friendCodeRequired: "Kaverikoodi vaaditaan.",
    friendName: "Kaverin nimi",
    index: "Järjestys",
    notLoggedIn: "Et ole kirjautunut sisään.",
    yourFriends: "Kaverisi",
    unfriend: "Poista",
    timeCoded: "Aika koodattu viimeisen {days} päivän aikana"
  },
  leaderboards: {
    admin: "Ylläpitäjä",
    createNewLeaderboard: "Luo uusi tulostaulu",
    joinLeaderboard: "Liity tulostauluun",
    leaderboards: "Tulostaulut",
    notLoggedIn: "Et ole kirjautunut sisään.",
    name: "Nimi",
    seeMore: "Katso lisää",
    topMember: "Paras jäsen",
    yourPosition: "Sijaintisi",
    leaveLeaderboard: "Poistu tulostaulusta",
    deleteLeaderboard: "Poista tulostaulu",
    demote: "Alenna",
    inviteCode: "Kutsukoodi",
    kick: "Erota",
    members: "Jäsenet",
    position: "Sija",
    promote: "Ylennä",
    timeCoded: "Aika koodattu viimeisen {days} päivän aikana",
    create: "Luo",
    leaderboardCreateError: "Tulostaulun luominen epäonnistui.",
    leaderboardExists: "Tulostaulu on jo olemassa.",
    validation: {
      min: "Tulostaulun nimen tulee olla vähintään {min} merkkiä pitkä.",
      max: "Tulostaulun nimen tulee olla enintään {max} merkkiä pitkä.",
      required: "Tulostaulun nimi vaaditaan.",
      regex: "Tulostaulun nimi voi sisältää vain alphanumeerisia kirjaimia."
    },
    join: {
      leaderboardCodeRequired: "Kutsukoodi vaaditaan.",
      alreadyMember: "Olet jo tämän tulostaulun jäsen.",
      genericError: "Tulosauluun liittyminen epäonnistui.",
      join: "Liity",
      leaderboardCode: "Tulostaulukoodi",
      leaderboardCodeInvalid:
        "Kutsukoodin tulee alkaa \"ttlic_\", ja sen jälkeen täytyy olla 24 alphanumeerista kirjainta.",

    }
  }
};

export default fi;
