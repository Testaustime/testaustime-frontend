import { Group } from "@mantine/core";
import { Footer } from "./Footer/Footer";
import Link from "next/link";
import { Navigation } from "./Navigation";
import styles from "../app/[locale]/layout.module.css";
import { TFunction } from "i18next";

export type PageLayoutProps = {
  isLoggedIn: boolean;
  username?: string;
  t: TFunction;
  children?: React.ReactNode;
  locale: string;
};

export const PageLayout = ({
  isLoggedIn,
  username,
  t,
  children,
  locale,
}: PageLayoutProps) => {
  return (
    <>
      <div>
        <Group justify="space-between" mb={50}>
          <Link href={"/" + locale} className={styles.testaustimeTitle}>
            Testaustime
          </Link>
          <Navigation
            isLoggedIn={isLoggedIn}
            username={username}
            t={t}
            locale={locale}
          />
        </Group>
        {children}
      </div>
      <Footer t={t} locale={locale} />
    </>
  );
};
