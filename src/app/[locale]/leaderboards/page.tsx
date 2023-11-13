import { Group, Title } from "@mantine/core";
import { LeaderboardsList } from "../../../components/leaderboard/LeaderboardsList";
import axios from "../../../axios";
import {
  ApiUsersUserResponse,
  Leaderboard,
  LeaderboardData,
} from "../../../types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import initTranslations from "../../i18n";
import { CreateNewLeaderboardButton } from "./CreateNewLeaderboardButton";
import { JoinLeaderboardButton } from "./JoinLeaderboardButton";

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

  const leaderboardListResponse = await axios.get<Leaderboard[]>(
    "/users/@me/leaderboards",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  const leaderboardPromises = leaderboardListResponse.data.map(
    async (leaderboard) => {
      const response = await axios.get<LeaderboardData>(
        `/leaderboards/${leaderboard.name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "X-Forwarded-For": req.socket.remoteAddress,
          },
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        },
      );
      return response.data;
    },
  );

  const leaderboards = await Promise.all(leaderboardPromises);

  const meResponse = await axios.get<ApiUsersUserResponse>("/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
      // "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

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
            />
            <JoinLeaderboardButton
              texts={{
                title: t("leaderboards.joinLeaderboard"),
                button: t("leaderboards.joinLeaderboard"),
              }}
            />
          </Group>
        </Group>
        <LeaderboardsList
          leaderboards={leaderboards}
          username={meResponse.data.username}
        />
      </div>
    </>
  );
}
