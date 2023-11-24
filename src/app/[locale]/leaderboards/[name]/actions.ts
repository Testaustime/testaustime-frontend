"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const regenerateInviteCode = async (leaderboardName: string) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/leaderboards/${leaderboardName}/regenerate`,
    {
      body: "{}", // https://github.com/Testaustime/testaustime-backend/issues/93
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" as const };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};
