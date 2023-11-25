import Link from "next/link";
import initTranslations from "../../i18n";

export default async function RateLimitedPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <div>
      <h1>{t("rateLimited.title")}</h1>
      <p>{t("rateLimited.text")}</p>
      <p>
        <Link href={`/${locale}`}>{t("rateLimited.link")}</Link>
      </p>
    </div>
  );
}
