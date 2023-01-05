import axios, { isAxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authTokenLocalStorageKey } from "../utils/constants";
import { getErrorMessage } from "../lib/errorHandling/errorHandler";
import {
  setAuthToken,
  setLoginInitialized
} from "../slices/userSlice";
import { RootState } from "../store";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
  registration_time: string,
  // TODO: is_public doesn't exist yet, depends on https://github.com/Testaustime/testaustime-backend/issues/62
  is_public?: boolean
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
  registration_time: string,
  is_public: boolean
}

export interface User {
  id: number,
  username: string,
  friendCode: string,
  registrationTime: Date,
  isPublic: boolean
}

export enum PasswordChangeResult {
  Success,
  OldPasswordIncorrect,
  NewPasswordInvalid,
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
  isPublic?: boolean,
  logOut: () => void,
  username?: string,
  friendCode?: string,
  refetchUser: () => Promise<void>,
  loginInitialized: boolean,
  changePassword: (oldPassword: string, newPassword: string) => Promise<PasswordChangeResult>
}

export const useAuthentication = (): UseAuthenticationResult => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const token = useSelector<RootState, string | undefined>(state => state.users.authToken);
  const loginInitialized = useSelector<RootState, boolean>(state => state.users.loginInitialized);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem(authTokenLocalStorageKey, newToken);
  };

  const { data: userData, refetch: refetchUser } = useQuery("fetchUser", async () => {
    try {
      const { data } = await axios.get<ApiUsersUserResponse>("/users/@me",
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      dispatch(setLoginInitialized(true));
      return {
        username: data.username,
        friendCode: data.friend_code,
        registrationTime: new Date(data.registration_time),
        isPublic: data.is_public
      };
    }
    catch (error) {
      queryClient.setQueryData("fetchUser", undefined);
      dispatch(setLoginInitialized(true));
      logOut();
      return undefined;
    }
  }, {
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  const { mutateAsync: regenerateToken } = useMutation(async () => {
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
  });

  const { mutateAsync: regenerateFriendCode } = useMutation(async () => {
    try {
      const { data } = await axios.post<ApiFriendsRegenerateResponse>("/friends/regenerate", null,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      const newFriendCode = data.friend_code;
      queryClient.setQueryData("fetchUser", (oldData: User | undefined) => {
        if (!oldData) throw new Error("User data not found");
        return ({
          ...oldData,
          friendCode: newFriendCode
        });
      });
      dispatch(setLoginInitialized(true));
      return newFriendCode;
    } catch (error) {
      dispatch(setLoginInitialized(true));
      throw getErrorMessage(error);
    }
  });

  const { mutateAsync: register } = useMutation(async (
    { username, password }: { username: string, password: string }
  ) => {
    try {
      const { data } = await axios.post<ApiAuthRegisterResponse>("/auth/register", { username, password });
      const authToken = data.auth_token;
      setToken(authToken);
      dispatch(setLoginInitialized(true));
      await queryClient.invalidateQueries("fetchUser");
      return authToken;
    } catch (error) {
      dispatch(setLoginInitialized(true));
      throw getErrorMessage(error);
    }
  });

  const { mutateAsync: login } = useMutation(async (
    { username, password }: { username: string, password: string }
  ) => {
    try {
      const { data } = await axios.post<ApiAuthLoginResponse>("/auth/login", { username, password });
      const { auth_token } = data;
      setToken(auth_token);
      await queryClient.invalidateQueries("fetchUser");
      dispatch(setLoginInitialized(true));
      return auth_token;
    } catch (error) {
      dispatch(setLoginInitialized(true));
      throw getErrorMessage(error);
    }
  });

  const logOut = () => {
    localStorage.removeItem(authTokenLocalStorageKey);
    dispatch(setAuthToken(undefined));
    queryClient.setQueryData("fetchUser", undefined);
    queryClient.setQueryData("friends", undefined);
    dispatch(setLoginInitialized(true));
  };

  const { mutateAsync: changePassword } = useMutation(async (
    { oldPassword, newPassword }: { oldPassword: string, newPassword: string }
  ) => {
    try {
      await axios.post(
        "/auth/changepassword",
        { old: oldPassword, new: newPassword },
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      return PasswordChangeResult.Success;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          return PasswordChangeResult.OldPasswordIncorrect;
        }
        else if (error.response?.status === 400) {
          return PasswordChangeResult.NewPasswordInvalid;
        }
      }
      throw getErrorMessage(error);
    }
  });

  const username = userData?.username;

  return {
    token,
    setToken,
    regenerateToken,
    regenerateFriendCode,
    register: (username: string, password: string) => register({ username, password }),
    login: (username: string, password: string) => login({ username, password }),
    logOut,
    username,
    registrationTime: userData?.registrationTime,
    friendCode: userData?.friendCode,
    isPublic: userData?.isPublic,
    refetchUser: async () => { await refetchUser(); },
    loginInitialized,
    isLoggedIn: Boolean(loginInitialized && !!username),
    isLoggedOut: Boolean(loginInitialized && !username),
    changePassword: (oldPassword: string, newPassword: string) => changePassword({ oldPassword, newPassword })
  };
};
