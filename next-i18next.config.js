// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  debug: process.env.NODE_ENV === "development",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fi"]
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
  strictMode: true,
  localePath: path.resolve("./public/locales"),
  react: {
    useSuspense: false
  }
};
