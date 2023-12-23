"use server";

import { cookies, headers } from "next/headers";
import {
  CreateLeaderboardError,
  GetLeaderboardError,
  GetLeaderboardsError,
  Leaderboard,
  LeaderboardData,
} from "../types";

export const getMyLeaderboards = async () => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return { error: GetLeaderboardsError.Unauthorized };
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/@me/leaderboards",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "client-ip": headers().get("client-ip") ?? "Unknown IP",
          "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
        },
        cache: "no-cache",
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { error: GetLeaderboardsError.Unauthorized };
      } else if (response.status === 429) {
        return { error: GetLeaderboardsError.RateLimited };
      }

      const errorText = await response.text();
      console.log("Unknown error when getting user's leaderboards:", errorText);

      return { error: GetLeaderboardsError.UnknownError };
    }

    const data = (await response.json()) as Leaderboard[];

    return data;
  } catch (e: unknown) {
    console.error("Unknown error when getting user's leaderboards:", e);
    return { error: GetLeaderboardsError.UnknownError };
  }
};

export const getLeaderboard = async (leaderboardName: string) => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return { error: GetLeaderboardError.Unauthorized };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
      next: {
        tags: [`leaderboard-${leaderboardName}`],
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: GetLeaderboardError.Unauthorized };
    } else if (response.status === 429) {
      return { error: GetLeaderboardError.RateLimited };
    }

    const errorText = await response.text();
    console.log(errorText);

    return { error: GetLeaderboardError.UnknownError };
  }

  const data = (await response.json()) as LeaderboardData;

  return data;
};

export const createLeaderboard = async (leaderboardName: string) => {
  const token = cookies().get("token")?.value;
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/leaderboards/create",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
      body: JSON.stringify({ name: leaderboardName }),
    },
  );

  if (!response.ok) {
    if (response.status === 409) {
      return { error: CreateLeaderboardError.AlreadyExists };
    } else if (response.status === 429) {
      return { error: CreateLeaderboardError.RateLimited };
    }

    console.error("Error while creating leaderboard:", await response.text());
    return { error: CreateLeaderboardError.UnknownError };
  }

  const data = (await response.json()) as { invite_code: string };

  return data;
};
