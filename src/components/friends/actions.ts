"use server";

import { cookies, headers } from "next/headers";
import { AddFriendError, RemoveFriendError } from "../../types";

export const removeFriend = async (username: string) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/friends/remove",
    {
      method: "DELETE",
      body: username,
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: RemoveFriendError.Unauthorized };
    } else if (response.status === 429) {
      return { error: RemoveFriendError.RateLimited };
    }

    return { error: RemoveFriendError.UnknownError };
  }
};

type ApiFriendsAddResponse = {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
};

export const addFriend = async (friendCode: string) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/friends/add",
    {
      method: "POST",
      body: friendCode,
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 409) {
      return { error: AddFriendError.AlreadyFriends };
    } else if (response.status === 404) {
      return { error: AddFriendError.NotFound };
    }

    return { error: AddFriendError.UnknownError };
  }

  const data = (await response.json()) as ApiFriendsAddResponse;

  return data;
};
