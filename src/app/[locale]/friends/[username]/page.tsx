import { redirect } from "next/navigation";
import { getFriendActivityData } from "../../../../api/friendsApi";
import { Dashboard } from "../../../../components/Dashboard";
import { getCurrentActivityStatus } from "../../../../api/usersApi";
import { CurrentActivity } from "../../../../components/CurrentActivity/CurrentActivity";

export default async function FriendPage({
  params: { locale, username },
}: {
  params: { locale: string; username: string };
}) {
  const data = await getFriendActivityData(username);

  if ("error" in data) {
    if (data.error === "Too many requests") {
      redirect("/rate-limited");
    } else if (data.error === "Unauthorized") {
      redirect("/login");
    } else {
      throw new Error(data.error);
    }
  }

  const decodedUsername = decodeURIComponent(username);

  let currentActivity: CurrentActivity | undefined = undefined;
  const currentActivityResponse =
    await getCurrentActivityStatus(decodedUsername);
  if (!("error" in currentActivityResponse)) {
    currentActivity = currentActivityResponse;
  }

  return (
    <Dashboard
      allEntries={data}
      username={decodedUsername}
      isFrontPage={false}
      locale={locale}
      initialActivity={currentActivity}
    />
  );
}
