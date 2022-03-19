import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../config";
import { useEffect, useState } from "react";
import { useAuthentication } from "./useAuthentication";
import { setFriends } from "../slices/userSlice";
import { RootState } from "../store";

export const useFriends =() => {
  const { token } = useAuthentication();
  const dispatch = useDispatch();

  const friends = useSelector<RootState, Array<string>>(state => state.users.friends);

  const listFriends = () => {
    const [entries, setEntries] = useState<Array<string>>([]);

    useEffect(() => {
      fetch(`${apiUrl}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(async response => {
        const data: Array<string> = await response.json();
        dispatch(setFriends(data));
        setEntries(data);
      }).catch(error => {
        console.log(error);
      });
    }, []);
  
    return entries;
  };

  const addFriend = async (friendCode: string) => {
    console.log(friendCode);
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
        return true;
      } else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    listFriends,
    addFriend,
    friends
  };
};
