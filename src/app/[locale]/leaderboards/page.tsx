import { Group, Title } from "@mantine/core";
import { LeaderboardsList } from "../../../components/leaderboard/LeaderboardsList";
import { GetRequestError, LeaderboardData } from "../../../types";
import { redirect } from "next/navigation";
import initTranslations from "../../i18n";
import { CreateNewLeaderboardButton } from "./CreateNewLeaderboardButton";
import { JoinLeaderboardButton } from "./JoinLeaderboardButton";
import { getMyLeaderboards } from "../../../api/leaderboardApi";

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
      case GetRequestError.RateLimited:
        redirect("/rate-limited");
        break;
      case GetRequestError.Unauthorized:
        redirect("/login");
        break;
      case GetRequestError.UnknownError:
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

  return (
    <>
      <Group align="center" mb="md" mt="xl" justify="space-between">
        <Title>{t("leaderboards.leaderboards")}</Title>
        <Group gap="sm">
          <CreateNewLeaderboardButton />
          <JoinLeaderboardButton />
        </Group>
      </Group>
      <LeaderboardsList leaderboards={leaderboardList} />
    </>
  );
}
