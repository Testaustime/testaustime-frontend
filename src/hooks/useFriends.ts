import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../config";
import { useEffect } from "react";
import { useAuthentication } from "./useAuthentication";
import { setFriends } from "../slices/userSlice";
import { RootState } from "../store";

export const useFriends = () => {
  const { token } = useAuthentication();
  const dispatch = useDispatch();

  const friends = useSelector<RootState, Array<string>>(state => state.users.friends);

  useEffect(() => {
    fetch(`${apiUrl}/friends/list`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async response => {
      const data: Array<string> = await response.json();
      dispatch(setFriends(data));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const addFriend = async (friendCode: string) => {
    try {
      const response = await fetch(`${apiUrl}/friends/add`, {
        method: "POST",
        body: friendCode,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      });
      if (response.ok) {
        const friendUsername = await response.text();
        dispatch(setFriends([...friends, friendUsername]));
        return friendUsername;
      } else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const unFriend = async (username: string) => {
    try {
      const response = await fetch(`${apiUrl}/friends/remove`, {
        method: "DELETE",
        body: username,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      });
      if (response.ok) {
        const friendUsername = await response.text();
        const index = friends.indexOf(username);
        if (index !== -1) {
          friends.splice(index, 1);
        }
        dispatch(setFriends(friends));
        return true;
      } else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };


  return {
    addFriend,
    unFriend,
    friends
  };
};
