"use server";

import { cookies, headers } from "next/headers";
import {
  DeleteLeaderboardError,
  JoinLeaderboardError,
  LeaveLeaderboardError,
} from "../../types";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const joinLeaderboard = async (inviteCode: string) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/leaderboards/join",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
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

    console.error("Error when joining leaderboard:", await response.text());
    return JoinLeaderboardError.UnknownError;
  }

  const data = (await response.json()) as {
    name: string;
    member_count: number;
  };

  revalidateTag(`leaderboard-${data.name}`);

  return data;
};

export const leaveLeaderboard = async (leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}/leave`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: LeaveLeaderboardError.Unauthorized };
    } else if (response.status === 429) {
      return { error: LeaveLeaderboardError.RateLimited };
    }

    console.error("Error when leaving leaderboard:", await response.text());
    return { error: LeaveLeaderboardError.UnknownError };
  }

  redirect("/leaderboards");
};

export const deleteLeaderboard = async (leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: DeleteLeaderboardError.Unauthorized };
    } else if (response.status === 429) {
      return { error: DeleteLeaderboardError.RateLimited };
    }

    console.error("Error when deleting leaderboard:", await response.text());
    return { error: DeleteLeaderboardError.UnknownError };
  }

  redirect("/leaderboards");
};
