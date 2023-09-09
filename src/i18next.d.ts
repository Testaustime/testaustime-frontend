import en from "../public/locales/en/common.json";
import fi from "../public/locales/fi/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en | typeof fi;
    };
  }
}

export type Locales = "en" | "fi";
