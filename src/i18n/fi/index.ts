import type { Translation } from "../i18n-types";

/* eslint sort-keys: ["error", "asc"] */
const fi: Translation = {
  copyToken: {
    copied: "Kopioitu!",
    copy: "Kopioi",
    hide: "Piilota",
    regenerate: "Generoi uudelleen",
    reveal: "Näytä"
  },
  dashboard: {
    greeting: "Hei, {username}!",
    languages: "Kielet",
    noData: {
      installPrompt: "<link>Asenna Testaustime-laajennus<link>, jotta voit nähdä tietoja.",
      title: "Ei näytettävää tietoa."
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
    totalTime: "Kokonaisaika viimeisten {days} päivän aikana: {totalTime}",
    unknownProject: "Tuntematon"
  },
  editProject: {
    projectName: "Projektin nimi",
    save: "Tallenna",
    title: "Muokataan {projectName}"
  },
  error: "Virhe",
  extensions: {
    body: "Lataa Testaustime-laajennus suosikkieditorillesi!",
    intellij: "Lataa Testaustime IntelliJ:lle",
    micro: "Lataa Testaustime Micro:lle",
    neovim: "Lataa Testaustime Neovim:lle",
    title: "Laajennukset",
    vscode: "Lataa Testaustime Visual Studio Code:lle"
  },
  footer: {
    authors: {
      core: "Pääkehittäjät",
      rest: " ja muut",
      suffix: "Tehnyt: "
    },
    copyright: "© {year} Testausserveri ry & muut",
    license: "Lisensoitu MIT-lisenssillä.",
    source: "Lähdekoodi",
    supportedBy: "Testausserveri ry:n tukema"
  },
  friends: {
    add: "Lisää",
    addNewFriend: "Lisää uusi kaveri",
    error: {
      alreadyFriends: "Olet jo kaveri tämän henkilön kanssa.",
      notFound: "Käyttäjää ei löytynyt",
      unknownError: "Tuntematon virhe"
    },
    errorRemovingFriend: "Kaverin poistamisessa tapahtui virhe.",
    friendCode: "Kaverikoodi",
    friendCodeInvalid: "Kaverikoodin tulee alkaa \"ttfc_\", ja sen jälkeen täytyy olla 24 alphanumeerista kirjainta.",
    friendCodeRequired: "Kaverikoodi vaaditaan.",
    friendDashboardTitle: "Käyttäjän {username} tilastot",
    friendName: "Kaverin nimi",
    index: "Järjestys",
    notLoggedIn: "Et ole kirjautunut sisään.",
    showDashboard: "Näytä",
    timeCoded: "Aika koodattu viimeisen {days} päivän aikana",
    unfriend: "Poista",
    yourFriends: "Kaverisi"
  },
  leaderboards: {
    admin: "Ylläpitäjä",
    create: "Luo",
    createNewLeaderboard: "Luo uusi tulostaulu",
    deleteLeaderboard: "Poista tulostaulu",
    demote: "Alenna",
    inviteCode: "Kutsukoodi",
    join: {
      alreadyMember: "Olet jo tämän tulostaulun jäsen.",
      genericError: "Tulostauluun liittyminen epäonnistui.",
      join: "Liity",
      leaderboardCode: "Tulostaulukoodi",
      leaderboardCodeInvalid:
        "Kutsukoodin tulee alkaa \"ttlic_\", ja sen jälkeen täytyy olla 24 alphanumeerista kirjainta.",
      leaderboardCodeRequired: "Kutsukoodi vaaditaan.",
      notFound: "Tulostaulua ei löytynyt."
    },
    joinLeaderboard: "Liity tulostauluun",
    kick: "Erota",
    leaderboardCreateError: "Tulostaulun luominen epäonnistui.",
    leaderboardExists: "Tulostaulu on jo olemassa.",
    leaderboards: "Tulostaulut",
    leaveLeaderboard: "Poistu tulostaulusta",
    members: "Jäsenet",
    name: "Nimi",
    notLoggedIn: "Et ole kirjautunut sisään.",
    position: "Sija",
    promote: "Ylennä",
    seeMore: "Katso lisää",
    timeCoded: "Aika koodattu viimeisen {days} päivän aikana",
    topMember: "Paras jäsen",
    validation: {
      max: "Tulostaulun nimen tulee olla enintään {max} merkkiä pitkä.",
      min: "Tulostaulun nimen tulee olla vähintään {min} merkkiä pitkä.",
      regex: "Tulostaulun nimi voi sisältää vain alphanumeerisia kirjaimia.",
      required: "Tulostaulun nimi vaaditaan."
    },
    yourPosition: "Sija"
  },
  loginPage: {
    invalidCredentials: "Virheelliset tunnukset",
    loginButton: "Kirjaudu",
    password: "Salasana",
    title: "Kirjautuminen",
    username: "Käyttäjänimi",
    validation: {
      password: {
        required: "Salasana vaaditaan"
      },
      username: {
        required: "Käyttäjänimi vaaditaan"
      }
    }
  },
  mainPage: {
    download: "Lataa nyt suosikkieditorillesi!",
    hero: "Paras työkalu ohjelmointituokioidesi ajankäytön seuraamiseen.\
    Näytä maailmalle, kuinka omistautunut olet projekteillesi!"
  },
  navbar: {
    account: "Tili",
    dashboard: "Etusivu",
    extensions: "Laajennukset",
    friends: "Kaverit",
    leaderboards: "Tulostaulut",
    logOut: "Kirjaudu ulos",
    login: "Kirjaudu sisään",
    register: "Rekisteröidy",
    settings: "Asetukset"
  },
  profile: {
    account: {
      title: "Minun tilini"
    },
    accountVisibility: {
      description: "Jos teet tilistäsi julkisen, muut \
      käyttäjät voivat etsiä profiilisi ja ohjelmointitilastosi ovat julkisia.",
      makePrivate: "Muuta yksityiseksi",
      makePublic: "Muuta julkiseksi",
      title: "Tilin näkyvyys"
    },
    authenticationToken: {
      title: "Tunnistautumistunnus",
      tooltip: {
        install: "Asenna Testaustime-laajennus täältä!",
        label: "Tätä tunnusta käytetään tunnistautumiseen koodieditorissasi."
      }
    },
    changePassword: {
      confirm: {
        noMatch: "Uusien salasanojen tulee olla samat",
        required: "Salasanavahvistus vaaditaan"
      },
      new: {
        invalid: "Uusi salasana ei ole kelvollinen",
        required: "Uusi salasana vaaditaan",
        tooLong: "Salasanan tulee olla enintään {max} merkkiä pitkä",
        tooShort: "Salasanan tulee olla vähintään {min} merkkiä pitkä"
      },
      newPassword: "Uusi salasana",
      newPasswordConfirm: "Vahvista salasana",
      old: {
        incorrect: "Vanha salasana on väärä",
        required: "Vanha salasana vaaditaan",
        tooLong: "Salasanan tulee olla enintään {max} merkkiä pitkä",
        tooShort: "Salasanan tulee olla vähintään {min} merkkiä pitkä"
      },
      oldPassword: "Vanha salasana",
      submit: "Vaihda salasana",
      success: {
        message: "Salasanasi on vaihdettu onnistuneesti.",
        title: "Salasana vaihdettu"
      },
      title: "Vaihda salasana"
    },
    deleteAccount: {
      button: "Poista tili",
      modal: {
        button: "Poista",
        text: "Kirjoita salasanasi vahvistaaksesi tilisi poistaminen. Tätä toimintoa ei voi peruuttaa.",
        title: "Käyttäjän poistaminen"
      },
      title: "Poista tili"
    },
    friendCode: {
      title: "Kaverikoodi",
      tooltip: "Tätä koodia käytetään, kun haluat jakaa dataa kavereillesi."
    },
    notLoggedIn: "Et ole kirjautunut sisään.",
    registrationTime: "Rekisteröitymisaika: {registrationTime}",
    settings: {
      defaultDayRange: "Oletuksena näytettävä aikaväli",
      language: "Kieli",
      smoothCharts: "Pehmeät kaaviot",
      title: "Asetukset"
    },
    title: "Profiili",
    username: "Käyttäjänimi: {username}"
  },
  prompt: {
    cancel: "Peruuta",
    confirmation: "Oletko varma?",
    yes: "Kyllä"
  },
  registrationPage: {
    invalidCredentials: "Virheelliset tunnukset",
    password: "Salasana",
    passwordConfirm: "Vahvista salasana",
    registerButton: "Rekisteröidy",
    username: "Käyttäjänimi",
    validation: {
      password: {
        max: "Salasana voi olla enintään {max} merkkiä pitkä",
        min: "Salasanan tulee olla vähintään {min} merkkiä pitkä",
        required: "Salasana vaaditaan"
      },
      passwordConfirm: {
        noMatch: "Salasanat eivät täsmää",
        required: "Salasanavahvistus vaaditaan"
      },
      username: {
        max: "Käyttäjänimi voi olla enintään {max} merkkiä pitkä",
        min: "Käyttäjänimen tulee olla vähintään {min} merkkiä pitkä",
        regex: "Käyttäjänimi voi sisältää vain alphanumeerisia merkkejä",
        required: "Käyttäjänimi vaaditaan"
      }
    }
  },
  theme: {
    dark: "Tumma teema",
    light: "Vaalea teema",
    toggle: "Vaihda väriteemaa"
  },
  unknownErrorOccurred: "Tapahtui tuntematon virhe."
};

export default fi;
