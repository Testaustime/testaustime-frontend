import type { GetStaticProps } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <main>
        <p>{t("dashboard.languages")}</p>
        <Link href="/" locale="fi">Go to Finnish page</Link>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  locale
}) => ({
  props: await serverSideTranslations(locale ?? "en")
});

export default Homepage;
