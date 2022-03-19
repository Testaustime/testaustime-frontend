import { apiUrl } from "../config";
import { useEffect, useState } from "react";
import { useAuthentication } from "./useAuthentication";

export const useFriends =() => {
  const listFriends = () => {
    const { token } = useAuthentication();
    const [entries, setEntries] = useState<Array<string>>([]);

    useEffect(() => {
      fetch(`${apiUrl}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(async response => {
        const data: Array<string> = await response.json();
        setEntries(data);
      }).catch(error => {
        console.log(error);
      });
    }, []);
  
    return entries;
  };

  const addFriend = async (friendCode: string) => {

    const { token } = useAuthentication();
    const [success, setSuccess] = useState<boolean>(false);

    await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      body: friendCode,
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain"
      }
    }).then(async response => {
      if (response.status == 200)
        setSuccess(true);
    }).catch(error => {
      console.log(error);
    });

    return success;
  };

  return {
    listFriends,
    addFriend
  };
};
