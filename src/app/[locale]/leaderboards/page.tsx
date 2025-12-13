import { Group, Title } from "@mantine/core";
import { LeaderboardsList } from "../../../components/leaderboard/LeaderboardsList";
import { GetLeaderboardsError, LeaderboardData } from "../../../types";
import { redirect } from "next/navigation";
import initTranslations from "../../i18n";
import { CreateNewLeaderboardButton } from "./CreateNewLeaderboardButton";
import { JoinLeaderboardButton } from "./JoinLeaderboardButton";
import { getMyLeaderboards } from "../../../api/leaderboardApi";
import { getPreferences } from "../../../utils/cookieUtils";
import { getMe } from "../../../api/usersApi";

export type LeaderboardsPageProps = {
  initialLeaderboards: LeaderboardData[];
  username: string;
  locale: string;
};

export default async function LeaderboardsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  const leaderboardList = await getMyLeaderboards();
  if (!Array.isArray(leaderboardList)) {
    switch (leaderboardList.error) {
      case GetLeaderboardsError.RateLimited:
        redirect("/rate-limited");
        break;
      case GetLeaderboardsError.Unauthorized:
        redirect("/login");
        break;
      case GetLeaderboardsError.UnknownError:
        return (
          <>
            <Group align="center" mb="md" mt="xl" justify="space-between">
              <Title>{t("leaderboards.leaderboards")}</Title>
              <Group gap="sm">
                <CreateNewLeaderboardButton />
                <JoinLeaderboardButton />
              </Group>
            </Group>
            <div>{t("leaderboards.error.loadingAllLeaderboards")}</div>
          </>
        );
    }
  }

  const me = await getMe();

  if (!me) {
    redirect("/login");
  }

  if ("error" in me) {
    if (me.error === "Unauthorized") {
      redirect("/login");
    } else if (me.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(JSON.stringify(me));
    }
  }

  const { maxTimeUnit } = getPreferences();

  return (
    <>
      <Group align="center" mb="md" mt="xl" justify="space-between">
        <Title>{t("leaderboards.leaderboards")}</Title>
        <Group gap="sm">
          <CreateNewLeaderboardButton />
          <JoinLeaderboardButton />
        </Group>
      </Group>
      <LeaderboardsList
        leaderboards={leaderboardList}
        maxTimeUnit={maxTimeUnit}
        meUsername={me.username}
      />
    </>
  );
}
