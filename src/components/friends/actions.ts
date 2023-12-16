"use server";

import { cookies } from "next/headers";
import { AddFriendError } from "../../types";

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
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" as const };
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
      },
    },
  );

  if (!response.ok) {
    if (response.status === 409) {
      return AddFriendError.AlreadyFriends;
    } else if (response.status === 404) {
      return AddFriendError.NotFound;
    }

    return AddFriendError.UnknownError;
  }

  const data = (await response.json()) as ApiFriendsAddResponse;

  return data;
};
