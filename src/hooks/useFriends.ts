import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useAuthentication from "./UseAuthentication";
import { setFriends } from "../slices/userSlice";
import { RootState } from "../store";
import axios from "axios";
import { getErrorMessage } from "../lib/errorHandling/errorHandler";

export interface ApiFriendsResponseItem {
  username: string,
  coding_time: {
    all_time: number,
    past_month: number,
    past_week: number,
  }
}

export interface ApiFriendsAddResponse {
  username: string,
  coding_time: {
    all_time: number,
    past_month: number,
    past_week: number,
  }
}

export const useFriends = () => {
  const { token } = useAuthentication();
  const dispatch = useDispatch();

  const friends = useSelector<RootState, ApiFriendsResponseItem[]>(state => state.users.friends);

  const fetchFriendData = async () => {
    const response = await axios.get<ApiFriendsResponseItem[]>("/friends/list", {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch(setFriends(response.data));
  };
  
  useEffect(() => {
    fetchFriendData();
  }, []);

  const addFriend = async (friendCode: string) => {
    try {
      const response = await axios.post<ApiFriendsAddResponse>("/friends/add", friendCode, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      });

      const friend = response.data;
      dispatch(setFriends([...friends, friend]));
      return friend;
    } catch (error) {
      throw getErrorMessage(error);
    }
  };

  const unFriend = async (username: string) => {
    try {
      await axios.delete("/friends/remove", {
        data: username,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      });

      dispatch(setFriends(friends.filter(f => f.username !== username)));
    } catch (error) {
      throw getErrorMessage(error);
    }
  };


  return {
    addFriend,
    unFriend,
    friends
  };
};
