"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import initTranslations from "../app/i18n";
import { i18n } from "i18next";

let i18nInstance: i18n | undefined = undefined;

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
}: {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
}) {
  const [instance, setInstance] = useState(i18nInstance);

  useEffect(() => {
    const init = async () => {
      if (!i18nInstance) {
        const newInstance = await initTranslations(locale, namespaces);
        i18nInstance = newInstance;
        setInstance(newInstance);
      } else {
        if (i18nInstance.language !== locale) {
          void i18nInstance.changeLanguage(locale);
        }
      }
    };

    void init();
  }, [locale, namespaces]);

  if (!instance) {
    return null;
  }

  return (
    <I18nextProvider i18n={instance} defaultNS={namespaces[0]}>
      {children}
    </I18nextProvider>
  );
}
