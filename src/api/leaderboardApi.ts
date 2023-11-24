"use server";

import { cookies } from "next/headers";
import {
  CreateLeaderboardError,
  GetLeaderboardError,
  Leaderboard,
  LeaderboardData,
} from "../types";
import { revalidateTag } from "next/cache";

export const getMyLeaderboards = async (token: string, username: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/users/@me/leaderboards",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
      next: {
        tags: [`leaderboards-${username}`],
      },
    },
  );

  const data = (await response.json()) as Leaderboard[];

  return data;
};

export const getLeaderboard = async (
  leaderboardName: string,
  token: string,
) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    },
  );

  if (response.status === 429) {
    return {
      error: GetLeaderboardError.TooManyRequests,
    };
  }

  const data = (await response.json()) as LeaderboardData;

  return data;
};

export const createLeaderboard = async (
  leaderboardName: string,
  username: string,
) => {
  const token = cookies().get("token")?.value;
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/leaderboards/create",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: leaderboardName }),
    },
  );

  if (response.status === 409) {
    return CreateLeaderboardError.AlreadyExists;
  }

  if (!response.ok) {
    console.log(await response.text());
    return CreateLeaderboardError.UnknownError;
  }

  const data = (await response.json()) as { invite_code: string };

  // TODO: username is provided by user, we should not trust it
  revalidateTag(`leaderboards-${username}`);

  return data;
};
