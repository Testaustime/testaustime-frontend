import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { Anchor, Text } from "@mantine/core";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../../components/Dashboard";
import axios from "../../axios";
import { ApiUsersUserActivityDataResponseItem } from "../../hooks/useActivityData";
import { startOfDay } from "date-fns";
import { DayRange, isDayRange } from "../../utils/dateUtils";
import {
  defaultDayRangeCookieName,
  smoothChartsCookieName,
} from "../../utils/constants";
import styles from "./index.module.css";
import { PageLayout } from "../../components/PageLayout";
import { ApiUsersUserResponse } from "../../types";

export type MainPageProps =
  | { isLoggedIn: false; locale: string }
  | {
      isLoggedIn: true;
      username: string;
      entries: ApiUsersUserActivityDataResponseItem[];
      defaultDayRange: DayRange | undefined | null;
      smoothCharts: boolean | undefined | null;
      locale: string;
    };

const MainPage = (props: MainPageProps) => {
  const { t } = useTranslation();

  return (
    <PageLayout
      t={t}
      isLoggedIn={props.isLoggedIn}
      username={"username" in props ? props.username : undefined}
      locale={props.locale}
    >
      <div
        className={
          !props.isLoggedIn ? styles.heroContainer : styles.dashboardContainer
        }
      >
        {props.isLoggedIn ? (
          <Dashboard
            username={props.username}
            isFrontPage={true}
            initialEntries={props.entries.map((e) => ({
              ...e,
              start_time: new Date(e.start_time),
              dayStart: startOfDay(new Date(e.start_time)),
            }))}
            defaultDayRange={props.defaultDayRange}
            smoothCharts={props.smoothCharts}
            locale={props.locale}
          />
        ) : (
          <>
            <Text mb={20} className={styles.heroText}>
              {t("mainPage.hero")}
            </Text>
            <Anchor
              className={styles.downloadButton}
              component={Link}
              href={`/${props.locale}/extensions`}
            >
              <DownloadIcon
                height={30}
                width={30}
                className={styles.downloadIcon}
              />
              {t("mainPage.download")}
            </Anchor>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<MainPageProps> = async ({
  params,
  req,
}) => {
  const token = req.cookies.token;
  if (!token) {
    return {
      props: {
        ...(await serverSideTranslations(String(params?.locale ?? "en"))),
        isLoggedIn: false,
        locale: String(params?.locale ?? "en"),
      },
    };
  }

  const response = await axios.get<ApiUsersUserActivityDataResponseItem[]>(
    "/users/@me/activity/data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  const defaultDayRange = isDayRange(req.cookies[defaultDayRangeCookieName])
    ? req.cookies[defaultDayRangeCookieName]
    : undefined;
  const smoothCharts =
    (req.cookies[smoothChartsCookieName] || "true") === "true";

  const meResponse = await axios.get<ApiUsersUserResponse>("/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  return {
    props: {
      ...(await serverSideTranslations(String(params?.locale ?? "en"))),
      isLoggedIn: true,
      entries: response.data,
      defaultDayRange: defaultDayRange ?? null,
      smoothCharts: smoothCharts,
      username: meResponse.data.username,
      locale: String(params?.locale ?? "en"),
    },
  };
};

export default MainPage;
