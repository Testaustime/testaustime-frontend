import {
  Badge,
  Group,
  Table,
  Title,
  TableTd,
  TableTr,
  TableTbody,
  TableThead,
  TableTh,
} from "@mantine/core";
import { getLeaderboard } from "../../../../api/leaderboardApi";
import { redirect } from "next/navigation";
import initTranslations from "../../../i18n";
import { getMe } from "../../../../api/usersApi";
import { getOrdinalSuffix } from "../../../../utils/stringUtils";
import { prettyDuration } from "../../../../utils/dateUtils";
import { DeleteLeaderboardButton } from "./DeleteLeaderboardButton";
import { LeaveLeaderboardButton } from "./LeaveLeaderboardButton";
import { LeaderboardInviteTokenField } from "./LeaderboardInviteTokenField";
import { DemoteUserButton } from "./DemoteUserButton";
import { PromoteUserButton } from "./PromoteUserButton";
import { KickUserButton } from "./KickUserButton";
import { GetLeaderboardError } from "../../../../types";
import { getPreferences } from "../../../../utils/cookieUtils";
import { YOU_BADGE_COLOR } from "../../../../utils/constants";

export default async function LeaderboardPage({
  params: { locale, name },
}: {
  params: { locale: string; name: string };
}) {
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

  const leaderboard = await getLeaderboard(name);
  if ("error" in leaderboard) {
    if (leaderboard.error === GetLeaderboardError.RateLimited) {
      redirect("/rate-limited");
    } else if (leaderboard.error === GetLeaderboardError.Unauthorized) {
      redirect("/login");
    } else {
      throw new Error(JSON.stringify(leaderboard));
    }
  }

  const { t } = await initTranslations(locale, ["common"]);

  const adminUsernames = leaderboard.members
    .filter((m) => m.admin)
    .map((m) => m.username);
  const isAdmin = adminUsernames.includes(me.username);
  const isLastAdmin = isAdmin && adminUsernames.length === 1;

  const { maxTimeUnit } = getPreferences();

  return (
    <>
      <Title order={1} mb="md">
        {leaderboard.name}
      </Title>
      <Group mb="md">
        <LeaveLeaderboardButton
          name={leaderboard.name}
          username={me.username}
          isLastAdmin={isLastAdmin}
        />
        {isAdmin && <DeleteLeaderboardButton name={leaderboard.name} />}
      </Group>
      <Title order={2} my="md">
        {t("leaderboards.inviteCode")}
      </Title>
      <LeaderboardInviteTokenField
        leaderboardName={leaderboard.name}
        inviteCode={leaderboard.invite}
        isAdmin={isAdmin}
      />
      <Title order={2} my="md">
        {t("leaderboards.members")}
      </Title>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>{t("leaderboards.position")}</TableTh>
            <TableTh>{t("leaderboards.name")}</TableTh>
            <TableTh>{t("leaderboards.timeCoded", { days: 7 })}</TableTh>
            {isAdmin && (
              <>
                <TableTh />
                <TableTh />
              </>
            )}
          </TableTr>
        </TableThead>
        <TableTbody>
          {[...leaderboard.members]
            .sort((a, b) => b.time_coded - a.time_coded)
            .map((member, i) => {
              return (
                <TableTr key={member.username}>
                  <TableTd>
                    {i + 1}
                    {getOrdinalSuffix(i + 1)}
                  </TableTd>
                  <TableTd>
                    {member.username}
                    {member.username === me.username && (
                      <Badge ml="sm" color={YOU_BADGE_COLOR}>
                        {t("leaderboards.you")}
                      </Badge>
                    )}
                    {member.admin && (
                      <Badge ml="sm">{t("leaderboards.admin")}</Badge>
                    )}
                  </TableTd>
                  <TableTd>
                    {prettyDuration(member.time_coded, maxTimeUnit)}
                  </TableTd>
                  {isAdmin && (
                    <>
                      <TableTd
                        style={{
                          width: 0,
                          padding: 0,
                          textAlign: "right",
                          paddingRight: 10,
                        }}
                      >
                        {member.username !== me.username && (
                          <KickUserButton
                            name={leaderboard.name}
                            username={member.username}
                          />
                        )}
                      </TableTd>
                      <TableTd
                        style={{
                          width: 0,
                          padding: 0,
                          textAlign: "right",
                        }}
                      >
                        {member.admin ? (
                          <DemoteUserButton
                            name={leaderboard.name}
                            username={member.username}
                          />
                        ) : (
                          <PromoteUserButton
                            name={leaderboard.name}
                            username={member.username}
                          />
                        )}
                      </TableTd>
                    </>
                  )}
                </TableTr>
              );
            })}
        </TableTbody>
      </Table>
    </>
  );
}
