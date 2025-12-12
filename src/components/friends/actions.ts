"use server";

import {
  postRequestWithoutResponse,
  postRequestWithResponse,
} from "../../api/baseApi";
import { AddFriendError } from "../../types";

export const removeFriend = (username: string) =>
  postRequestWithoutResponse(
    "/friends/remove",
    {
      name: username,
    },
    "DELETE",
  );

type ApiFriendsAddResponse = {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
};

export const addFriend = async (friendCode: string) => {
  const res = await postRequestWithResponse<ApiFriendsAddResponse>(
    "/friends/add",
    {
      code: friendCode,
    },
  );

  if ("error" in res) {
    if (res.statusCode === 409) {
      return { error: AddFriendError.AlreadyFriends };
    } else if (res.statusCode === 404) {
      return { error: AddFriendError.NotFound };
    }
  }

  return res;
};
