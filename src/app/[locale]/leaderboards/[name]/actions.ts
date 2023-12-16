"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const regenerateInviteCode = async (leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/leaderboards/${leaderboardName}/regenerate`,
    {
      body: "{}", // https://github.com/Testaustime/testaustime-backend/issues/93
      method: "POST",
      cache: "no-cache",
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

export const promoteUser = async (
  username: string,
  leaderboardName: string,
) => {
  const token = cookies().get("secure-access-token")?.value;

  if (!token) {
    return { error: "Unauthorized" as const };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/leaderboards/${leaderboardName}/promote`,
    {
      body: JSON.stringify({ user: username }),
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    console.log(response.status);
    if (response.status === 429) {
      return { error: "Too many requests" as const };
    }

    return { error: "Unknown error" as const };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};

export const demoteUser = async (username: string, leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  if (!token) {
    return { error: "Unauthorized" as const };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}/demote`,
    {
      body: JSON.stringify({ user: username }),
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return { error: "Too many requests" as const };
    }

    return { error: "Unknown error" as const };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};

export const kickUser = async (username: string, leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  if (!token) {
    return { error: "Unauthorized" as const };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}/kick`,
    {
      body: JSON.stringify({ user: username }),
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return { error: "Too many requests" as const };
    }

    return { error: "Unknown error" as const };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};
