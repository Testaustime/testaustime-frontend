import en from "./en";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en
    }
  }
}
