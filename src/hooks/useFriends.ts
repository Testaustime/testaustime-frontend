import { useAuthentication } from "./useAuthentication";
import axios from "../axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { isAxiosError } from "axios";

export interface ApiFriendsResponseItem {
  username: string,
  coding_time: {
    all_time: number,
    past_month: number,
    past_week: number
  }
}

export interface ApiFriendsAddResponse {
  username: string,
  coding_time: {
    all_time: number,
    past_month: number,
    past_week: number
  }
}

export enum AddFriendError {
  AlreadyFriends,
  NotFound,
  UnknownError
}

export const useFriends = () => {
  const { token } = useAuthentication();
  const queryClient = useQueryClient();

  const { data: friends } = useQuery("friends", async () => {
    const response = await axios.get<ApiFriendsResponseItem[]>("/friends/list", {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    return response.data;
  }, {
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  const { mutateAsync: addFriend } = useMutation(async (friendCode: string) => {
    const response = await axios.post<ApiFriendsAddResponse>("/friends/add", friendCode, {
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        "Content-Type": "text/plain"
      }
    });
    return response.data;
  }, {
    onSuccess: data => {
      queryClient.setQueryData("friends", (friends ?? []).concat(data));
    }
  });

  const { mutateAsync: unFriend } = useMutation(async (username: string) => {
    await axios.delete("/friends/remove", {
      data: username,
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        "Content-Type": "text/plain"
      }
    });
    return username;
  }, {
    onSuccess: username => {
      queryClient.setQueryData("friends", (friends ?? []).filter(f => f.username !== username));
    }
  });

  return {
    addFriend: async (friendCode: string) => {
      try {
        return await addFriend(friendCode);
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response?.status === 409
            // TODO: The 403 status is a bug with the backend.
            // It can be removed when https://github.com/Testaustime/testaustime-backend/pull/61 is merged
            || e.response?.status === 403) {
            return AddFriendError.AlreadyFriends;
          } else if (e.response?.status === 404) {
            return AddFriendError.NotFound;
          }
        }
        return AddFriendError.UnknownError;
      }
    },
    unFriend,
    friends: friends ?? []
  };
};
