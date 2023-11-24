"use server";

import { cookies } from "next/headers";
import { JoinLeaderboardError } from "../../types";
import { revalidateTag } from "next/cache";

export const joinLeaderboard = async (inviteCode: string, username: string) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/leaderboards/join",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        invite: inviteCode,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 409) {
      return JoinLeaderboardError.AlreadyMember;
    } else if (response.status === 404) {
      return JoinLeaderboardError.NotFound;
    }
    return JoinLeaderboardError.UnknownError;
  }

  const data = (await response.json()) as {
    name: string;
    member_count: number;
  };

  revalidateTag(`leaderboards-${username}`);

  return data;
};

export const leaveLeaderboard = async (
  leaderboardName: string,
  username: string,
) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}/leave`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" };
  }

  revalidateTag(`leaderboards-${username}`);
};

export const deleteLeaderboard = async (
  leaderboardName: string,
  username: string,
) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" };
  }

  revalidateTag(`leaderboards-${username}`);
};
