import { CurrentActivityApiResponse } from "../types";
import { cookies, headers } from "next/headers";

export interface ApiFriendsResponseItem {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
  status: CurrentActivityApiResponse | null;
}

export const getFriendsList = async () => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return {
      error: "Unauthorized" as const,
    };
  }

  const friendsPromise = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friends/list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
    },
  );

  if (!friendsPromise.ok) {
    if (friendsPromise.status === 401) {
      return {
        error: "Unauthorized" as const,
      };
    }

    if (friendsPromise.status === 429) {
      return {
        error: "Too many requests" as const,
      };
    }

    return {
      error: "Unknown error when fetching /friends/list" as const,
      status: friendsPromise.status,
    };
  }

  const data = (await friendsPromise.json()) as ApiFriendsResponseItem[];

  return data;
};
