import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useAuthentication from "./UseAuthentication";
import { setFriends } from "../slices/userSlice";
import { RootState } from "../store";
import axios from "axios";
import { getErrorMessage } from "../lib/errorHandling/errorHandler";

export interface ApiFriendsAddResponse {
  name: string
}

export const useFriends = () => {
  const { token } = useAuthentication();
  const dispatch = useDispatch();

  const friends = useSelector<RootState, Array<string>>(state => state.users.friends);

  useEffect(() => {
    axios.get<string[]>("/friends/list", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      dispatch(setFriends(response.data));
    });
  }, []);

  const addFriend = async (friendCode: string) => {
    try {
      const response = await axios.post<ApiFriendsAddResponse>("/friends/add", friendCode, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      });

      const friendUsername = response.data.name;
      dispatch(setFriends([...friends, friendUsername]));
      return friendUsername;
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

      dispatch(setFriends(friends.filter(f => f !== username)));
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
