import useAuthentication from "./UseAuthentication";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
    addFriend,
    unFriend,
    friends: friends ?? []
  };
};
