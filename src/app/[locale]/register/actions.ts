"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { postRequestWithResponse } from "../../../api/baseApi";
import { PostRequestError, RegistrationResult } from "../../../types";

interface ApiAuthLoginResponse {
  id: number;
  auth_token: string;
  friend_code: string;
  username: string;
  registration_time: string;
  is_public: boolean;
}

export const register = async (username: string, password: string) => {
  const res = await postRequestWithResponse<ApiAuthLoginResponse>(
    "/auth/register",
    {
      username,
      password,
    },
  );

  if ("error" in res) {
    if (res.statusCode === 409) {
      return RegistrationResult.UsernameTaken;
    }
    if (res.statusCode === 429) {
      return PostRequestError.RateLimited;
    }

    return PostRequestError.UnknownError;
  }

  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  cookies().set("token", res.data.auth_token, {
    value: res.data.auth_token,
    expires: expiration,
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  });

  redirect("/");
};
