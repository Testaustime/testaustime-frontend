// TODO: Remove
/* eslint-disable @typescript-eslint/no-throw-literal */

import axios from "../axios";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../lib/errorHandling/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ApiAuthRegisterResponse {
  auth_token: string;
  username: string;
  friend_code: string;
  registration_time: string;
}

export interface ApiAuthRegenerateResponse {
  token: string;
}

export interface ApiFriendsRegenerateResponse {
  friend_code: string;
}

export interface ApiUsersUserResponse {
  id: number;
  username: string;
  friend_code: string;
  registration_time: string;
  is_public: boolean;
}

export interface User {
  id: number;
  username: string;
  friendCode: string;
  registrationTime: Date;
  isPublic: boolean;
}

export enum PasswordChangeResult {
  Success,
  OldPasswordIncorrect,
  NewPasswordInvalid,
}

export enum RegistrationResult {
  Success,
  RateLimited,
}

export const useAuthentication = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: regenerateToken } = useMutation(async () => {
    try {
      const { data } = await axios.post<ApiAuthRegenerateResponse>(
        "/auth/regenerate",
        null,
      );
      const newToken = data.token;
      return newToken;
    } catch (error) {
      throw getErrorMessage(error);
    }
  });

  const { mutateAsync: regenerateFriendCode } = useMutation(async () => {
    try {
      const { data } = await axios.post<ApiFriendsRegenerateResponse>(
        "/friends/regenerate",
        null,
      );
      const newFriendCode = data.friend_code;
      queryClient.setQueryData(["fetchUser"], (oldData: User | undefined) => {
        if (!oldData) throw new Error("User data not found");
        return {
          ...oldData,
          friendCode: newFriendCode,
        };
      });
      return newFriendCode;
    } catch (error) {
      throw getErrorMessage(error);
    }
  });

  const { mutateAsync: register } = useMutation(
    async ({ username, password }: { username: string; password: string }) => {
      try {
        const { data } = await axios.post<ApiAuthRegisterResponse>(
          "/auth/register",
          { username, password },
        );
        queryClient.setQueryData(["fetchUser"], {
          username: data.username,
          friendCode: data.friend_code,
          registrationTime: new Date(data.registration_time),
          isPublic: false,
        });
        return RegistrationResult.Success;
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 429) {
            return RegistrationResult.RateLimited;
          }
        }
        throw getErrorMessage(error);
      }
    },
  );

  const { mutateAsync: logOut } = useMutation(async () => {
    try {
      await axios.post("/auth/logout", null);
      queryClient.clear();
    } catch (error) {
      throw getErrorMessage(error);
    }
  });

  const { mutateAsync: changePassword } = useMutation(
    async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      try {
        await axios.post("/auth/changepassword", {
          old: oldPassword,
          new: newPassword,
        });
        return PasswordChangeResult.Success;
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            return PasswordChangeResult.OldPasswordIncorrect;
          } else if (error.response?.status === 400) {
            return PasswordChangeResult.NewPasswordInvalid;
          }
        }
        throw getErrorMessage(error);
      }
    },
  );

  return {
    regenerateToken,
    regenerateFriendCode,
    register: (username: string, password: string) =>
      register({ username, password }),
    logOut,
    changePassword: (oldPassword: string, newPassword: string) =>
      changePassword({ oldPassword, newPassword }),
  };
};
