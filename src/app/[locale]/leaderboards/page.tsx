import { Group, Title } from "@mantine/core";
import { LeaderboardsList } from "../../../components/leaderboard/LeaderboardsList";
import { GetLeaderboardError, LeaderboardData } from "../../../types";
import { cookies } from "next/headers";
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
  const token = cookies().get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const me = await getMe(token);

  if ("error" in me) {
    if (me.error === "Unauthorized") {
      cookies().delete("token");
      redirect("/login");
    } else if (me.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(me.error);
    }
  }

  const leaderboardList = await getMyLeaderboards(token, me.username);

  const leaderboardPromises = leaderboardList.map((leaderboard) =>
    getLeaderboard(leaderboard.name, token),
  );

  const leaderboards = await Promise.all(leaderboardPromises);

  const safeLeaderboards = leaderboards.filter(
    (x): x is LeaderboardData => !("error" in x),
  );

  const erroredLeaderboards = leaderboards.filter(
    (x): x is { error: GetLeaderboardError } => "error" in x,
  );

  if (erroredLeaderboards.length > 0) {
    console.error(
      "Errors while loading leaderboards",
      erroredLeaderboards.map((x) => x.error),
    );
    redirect("/rate-limited");
  }

  const { t } = await initTranslations(locale, ["common"]);

  return (
    <>
      <div>
        <Group align="center" mb="md" mt="xl" justify="space-between">
          <Title>{t("leaderboards.leaderboards")}</Title>
          <Group gap="sm">
            <CreateNewLeaderboardButton
              texts={{
                button: t("leaderboards.createNewLeaderboard"),
                createNewLeaderboardTitle: t(
                  "leaderboards.createNewLeaderboard",
                ),
                modal: {
                  error: t("error"),
                  leaderboardExists: t("leaderboards.leaderboardExists"),
                  leaderboardCreateError: t(
                    "leaderboards.leaderboardCreateError",
                  ),
                  validation: {
                    required: t("leaderboards.validation.required"),
                    min: t("leaderboards.validation.min", { min: 2 }),
                    max: t("leaderboards.validation.max", { max: 32 }),
                    regex: t("leaderboards.validation.regex"),
                  },
                  create: t("leaderboards.create"),
                },
              }}
              username={me.username}
            />
            <JoinLeaderboardButton
              texts={{
                title: t("leaderboards.joinLeaderboard"),
                button: t("leaderboards.joinLeaderboard"),
              }}
              username={me.username}
            />
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
