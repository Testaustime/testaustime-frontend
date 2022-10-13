import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authTokenLocalStorageKey } from "../../constants";
import { getErrorMessage } from "../../lib/errorHandling/errorHandler";
import {
  setAuthToken,
  setUsername,
  setRegisterTime,
  setFriendCode,
  setFriends,
  setLoginInitialized
} from "../../slices/userSlice";
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
  username: string,
  friend_code: string,
  registration_time: string
}

export interface UseAuthenticationResult {
  token?: string,
  setToken: (newToken: string) => void,
  isLoggedIn: boolean,
  isLoggedOut: boolean,
  regenerateToken: () => Promise<string>,
  regenerateFriendCode: () => Promise<string>,
  register: (username: string, password: string) => Promise<string>,
  login: (username: string, password: string) => Promise<string>,
  registrationTime?: Date,
  logOut: () => void,
  username?: string,
  friendCode?: string,
  refetchUsername: () => Promise<string>,
  loginInitialized: boolean
}

export const useAuthentication = (): UseAuthenticationResult => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string | undefined>(state => state.users.authToken);
  const username = useSelector<RootState, string | undefined>(state => state.users.username);
  const registrationTime = useSelector<RootState, Date | undefined>(state =>
    state.users.registrationTime ? new Date(state.users.registrationTime) : undefined);
  const friendCode = useSelector<RootState, string | undefined>(state => state.users.friendCode);
  const loginInitialized = useSelector<RootState, boolean>(state => state.users.loginInitialized);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem(authTokenLocalStorageKey, newToken);
  };

  const regenerateToken = async () => {
    try {
      const { data } = await axios.post<ApiAuthRegenerateResponse>("/auth/regenerate", null,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      const newToken = data.token;
      setToken(newToken);
      dispatch(setLoginInitialized(true));
      return newToken;
    } catch (error) {
      dispatch(setLoginInitialized(true));
      throw getErrorMessage(error);
    }
  };

  const regenerateFriendCode = async () => {
    try {
      const { data } = await axios.post<ApiFriendsRegenerateResponse>("/friends/regenerate", null,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      const newFriendCode = data.friend_code;
      dispatch(setFriendCode(newFriendCode));
      dispatch(setLoginInitialized(true));
      return newFriendCode;
    } catch (error) {
      dispatch(setLoginInitialized(true));
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
      dispatch(setLoginInitialized(true));
      return auth_token;
    } catch (error) {
      dispatch(setLoginInitialized(true));
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
      dispatch(setLoginInitialized(true));
      return auth_token;
    } catch (err) {
      dispatch(setLoginInitialized(true));
      throw getErrorMessage(err);
    }
  };

  const logOut = () => {
    localStorage.removeItem(authTokenLocalStorageKey);
    dispatch(setAuthToken(undefined));
    dispatch(setUsername(undefined));
    dispatch(setFriendCode(undefined));
    dispatch(setRegisterTime(undefined));
    dispatch(setLoginInitialized(true));
    dispatch(setFriends([]));
  };

  const refetchUsername = async () => {
    if (!token) {
      dispatch(setUsername(""));
      logOut();
      return "";
    }

    try {
      const { data } = await axios.get<ApiUsersUserResponse>("/users/@me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setUsername(data.username));
      dispatch(setFriendCode(data.friend_code));
      dispatch(setRegisterTime(data.registration_time));
      dispatch(setLoginInitialized(true));
      return data.username;
    } catch (error) {
      dispatch(setUsername(""));
      dispatch(setLoginInitialized(true));
      logOut();
      return "";
    }
  };

  return {
    token,
    setToken,
    regenerateToken,
    regenerateFriendCode,
    register,
    login,
    logOut,
    username,
    registrationTime,
    friendCode,
    refetchUsername,
    loginInitialized,
    isLoggedIn: Boolean(loginInitialized && !!username),
    isLoggedOut: Boolean(loginInitialized && !username)
  };
};
