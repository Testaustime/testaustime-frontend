import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../../config";
import { authTokenLocalStorageKey } from "../../constants";
import { setAuthToken, setUsername, setRegisterTime, setFriendCode, setFriends } from "../../slices/userSlice";
import { RootState } from "../../store";

export interface UseAuthenticationResult {
  token: string,
  setToken: (newToken: string) => void,
  isLoggedIn: boolean,
  regenerateToken: () => Promise<string>,
  register: (username: string, password: string) => Promise<string>,
  login: (username: string, password: string) => Promise<string>,
  logOut: () => void,
  username: string,
  refetchUsername: () => Promise<string>
}

export const useAuthentication = (): UseAuthenticationResult => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string>(state => state.users.authToken);
  const username = useSelector<RootState, string>(state => state.users.username);
  const registrationTime = useSelector<RootState, Date>(state => state.users.registrationTime);
  const friendCode = useSelector<RootState, string>(state => state.users.friendCode);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem(authTokenLocalStorageKey, newToken);
  };

  const regenerateToken = async (): Promise<string> => {
    try {
      const response = await fetch(`${apiUrl}/auth/regenerate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
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

  const register = async (username: string, password: string): Promise<string> => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
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

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
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

  const logOut = () => {
    dispatch(setAuthToken(""));
    dispatch(setUsername(""));
    localStorage.removeItem(authTokenLocalStorageKey);
    dispatch(setFriendCode(""));
    dispatch(setRegisterTime(new Date()));
    dispatch(setFriends([""]));
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
          return data.user_name;
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
