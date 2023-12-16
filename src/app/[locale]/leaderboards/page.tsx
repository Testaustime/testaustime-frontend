import { Group, Title } from "@mantine/core";
import { LeaderboardsList } from "../../../components/leaderboard/LeaderboardsList";
import {
  GetLeaderboardError,
  GetLeaderboardsError,
  LeaderboardData,
} from "../../../types";
import { redirect } from "next/navigation";
import initTranslations from "../../i18n";
import { CreateNewLeaderboardButton } from "./CreateNewLeaderboardButton";
import { JoinLeaderboardButton } from "./JoinLeaderboardButton";
import { getLeaderboard, getMyLeaderboards } from "../../../api/leaderboardApi";
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
  const me = await getMe();
  if ("error" in me) {
    if (me.error === "Unauthorized") {
      redirect("/login");
    } else if (me.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(me.error);
    }
  }

  const { t } = await initTranslations(locale, ["common"]);

  const leaderboardList = await getMyLeaderboards(me.username);
  if (!Array.isArray(leaderboardList)) {
    if (leaderboardList === GetLeaderboardsError.TooManyRequests) {
      redirect("/rate-limited");
    } else if (leaderboardList === GetLeaderboardsError.Unauthorized) {
      redirect("/login");
    } else {
      return (
        <>
          <Group align="center" mb="md" mt="xl" justify="space-between">
            <Title>{t("leaderboards.leaderboards")}</Title>
            <Group gap="sm">
              <CreateNewLeaderboardButton username={me.username} />
              <JoinLeaderboardButton />
            </Group>
          </Group>
          <div>{t("leaderboards.error.loadingAllLeaderboards")}</div>
        </>
      );
    }
  }

  const leaderboardPromises = leaderboardList.map((leaderboard) =>
    getLeaderboard(leaderboard.name),
  );

  const leaderboards = await Promise.all(leaderboardPromises);

  const safeLeaderboards = leaderboards.filter(
    (x): x is LeaderboardData => typeof x === "object",
  );

  const erroredLeaderboards = leaderboards.filter(
    (x): x is GetLeaderboardError => typeof x !== "object",
  );

  if (erroredLeaderboards.length > 0) {
    console.error("Errors while loading leaderboards", erroredLeaderboards);
    // TODO: Not all errors are necessarily rate limits
    redirect("/rate-limited");
  }

  return (
    <>
      <div>
        <Group align="center" mb="md" mt="xl" justify="space-between">
          <Title>{t("leaderboards.leaderboards")}</Title>
          <Group gap="sm">
            <CreateNewLeaderboardButton username={me.username} />
            <JoinLeaderboardButton />
          </Group>
        </Group>
        <LeaderboardsList
          leaderboards={safeLeaderboards}
          username={me.username}
        />
      </div>
    </>
  );
}
