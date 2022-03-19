import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../config";
import { setAuthToken, setUsername, setRegisterTime, setFriendCode } from "../slices/userSlice";
import { RootState } from "../store";

export const useAuthentication = () => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string>(state => state.users.authToken);
  const username = useSelector<RootState, string>(state => state.users.username);
  const registrationTime = useSelector<RootState, Date>(state => state.users.registrationTime);
  const friendCode = useSelector<RootState, string>(state => state.users.friendCode);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem("authToken", newToken);
  };

  const regenerateToken = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/regenerate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const newToken = await response.text();
        setToken(newToken);
        return newToken;
      }
      else {
        return Promise.reject(await response.text());
      }
    }
    catch (error) {
      return Promise.reject(error);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const authToken = await response.text();
        setToken(authToken);
        dispatch(setUsername(username));
        return authToken;
      }
      else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const authToken = await response.text();
        setToken(authToken);
        dispatch(setUsername(username));
      }
      else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logOut = () => {
    dispatch(setAuthToken(""));
    dispatch(setUsername(""));
    dispatch(setFriendCode(""));
    dispatch(setRegisterTime(new Date()));
    localStorage.removeItem("authToken");
  };

  const refetchUsername = async () => {
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/@me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setUsername(data.user_name));
          dispatch(setFriendCode(data.friend_code));
          dispatch(setRegisterTime(data.registration_time));
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      dispatch(setUsername(""));
    }
  };

  return {
    token,
    setToken,
    isLoggedIn: !!token,
    regenerateToken,
    register,
    login,
    logOut,
    username,
    registrationTime,
    friendCode,
    refetchUsername
  };
};
