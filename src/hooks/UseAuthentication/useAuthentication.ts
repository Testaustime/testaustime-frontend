import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authTokenLocalStorageKey } from "../../constants";
import { getErrorMessage } from "../../lib/errorHandling/errorHandler";
import { setAuthToken, setUsername, setRegisterTime, setFriendCode, setFriends } from "../../slices/userSlice";
import { RootState } from "../../store";

export interface ApiAuthRegisterResponse {
  auth_token: string,
  username: string,
  friend_code: string,
  registration_time: string
}

export interface ApiAuthLoginResponse {
  id: number,
  auth_token: string,
  friend_code: string,
  username: string,
  registration_time: string
}

export interface ApiAuthRegenerateResponse {
  token: string
}

export interface ApiFriendsRegenerateResponse {
  friend_code: string
}

export interface ApiUsersUserResponse {
  id: number,
  user_name: string,
  friend_code: string,
  registration_time: string
}

export interface UseAuthenticationResult {
  token?: string,
  setToken: (newToken: string) => void,
  isLoggedIn: boolean,
  regenerateToken: () => Promise<string>,
  regenerateFriendCode: () => Promise<string>,
  register: (username: string, password: string) => Promise<string>,
  login: (username: string, password: string) => Promise<string>,
  registrationTime?: Date,
  logOut: () => void,
  username?: string,
  friendCode?: string,
  refetchUsername: () => Promise<string>
}

export const useAuthentication = (): UseAuthenticationResult => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string | undefined>(state => state.users.authToken);
  const username = useSelector<RootState, string | undefined>(state => state.users.username);
  const registrationTime = useSelector<RootState, Date | undefined>(state => state.users.registrationTime ? new Date(state.users.registrationTime) : undefined);
  const friendCode = useSelector<RootState, string | undefined>(state => state.users.friendCode);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem(authTokenLocalStorageKey, newToken);
  };

  const regenerateToken = async () => {
    try {
      const { data } = await axios.post<ApiAuthRegenerateResponse>("/auth/regenerate", null, { headers: { Authorization: `Bearer ${token}` } });
      const newToken = data.token;
      setToken(newToken);
      return newToken;
    } catch (error) {
      throw getErrorMessage(error);
    }
  };

  const regenerateFriendCode = async () => {
    try {
      const { data } = await axios.post<ApiFriendsRegenerateResponse>("/friends/regenerate", null, { headers: { Authorization: `Bearer ${token}` } });
      const newFriendCode = data.friend_code;
      dispatch(setFriendCode(newFriendCode));
      return newFriendCode;
    } catch (error) {
      throw getErrorMessage(error);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const { data } = await axios.post<ApiAuthRegisterResponse>("/auth/register", { username, password });
      const { auth_token, friend_code, username: apiUsername, registration_time } = data;
      setToken(auth_token);
      dispatch(setUsername(apiUsername));
      dispatch(setFriendCode(friend_code));
      dispatch(setRegisterTime(registration_time));
      return auth_token;
    } catch (error) {
      throw getErrorMessage(error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { data } = await axios.post<ApiAuthLoginResponse>("/auth/login", { username, password });
      const { auth_token, friend_code, username: apiUsername, registration_time } = data;
      setToken(auth_token);
      dispatch(setUsername(apiUsername));
      dispatch(setFriendCode(friend_code));
      dispatch(setRegisterTime(registration_time));
      return auth_token;
    } catch (err) {
      throw getErrorMessage(err);
    }
  };

  const logOut = () => {
    localStorage.removeItem(authTokenLocalStorageKey);
    dispatch(setAuthToken(undefined));
    dispatch(setUsername(undefined));
    dispatch(setFriendCode(undefined));
    dispatch(setRegisterTime(undefined));
    dispatch(setFriends([]));
  };

  const refetchUsername = async () => {
    if (token) {
      try {
        const { data } = await axios.get("/users/@me", { headers: { Authorization: `Bearer ${token}` } });
        dispatch(setUsername(data.user_name));
        dispatch(setFriendCode(data.friend_code));
        dispatch(setRegisterTime(data.registration_time));
        return data.user_name;
      } catch (error) {
        dispatch(setUsername(""));
        return "";
      }
    }
    else {
      dispatch(setUsername(""));
      return "";
    }
  };

  return {
    token,
    setToken,
    isLoggedIn: !!token,
    regenerateToken,
    regenerateFriendCode,
    register,
    login,
    logOut,
    username,
    registrationTime,
    friendCode,
    refetchUsername
  };
};
