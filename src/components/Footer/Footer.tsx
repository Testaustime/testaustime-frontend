import { Text, Anchor } from "@mantine/core";
import TestausserveriLogo from "../../../public/images/testausserveri.svg";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import styles from "./Footer.module.css";
import type { TFunction } from "i18next";

export const Footer = ({ t, locale }: { t: TFunction; locale: string }) => {
  return (
    <div className={styles.container}>
      <hr className={styles.line} />
      <div className={styles.content}>
        <div>
          <a href="https://testausserveri.fi">
            <TestausserveriLogo
              className={styles.bwLogo}
              height={90}
              width={155}
            />
          </a>
          <Text>{t("footer.supportedBy")}</Text>
        </div>
        <div className={styles.rightSection}>
          <Text>
            ❤️ {t("footer.authors.suffix")}
            <Anchor href="https://github.com/orgs/Testaustime/people">
              {t("footer.authors.core")}
            </Anchor>
            {t("footer.authors.rest")}
          </Text>
          <Text>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </Text>
          <Text>
            <i>{t("footer.license")}</i>{" "}
            <Anchor href="https://github.com/Testaustime">
              {t("footer.source")}
            </Anchor>
          </Text>
          <LanguageSelector
            type="dropdown"
            showLabel={false}
            size="sm"
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
};
