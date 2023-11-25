"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegistrationResult } from "../../../types";

export interface ApiAuthLoginResponse {
  id: number;
  auth_token: string;
  friend_code: string;
  username: string;
  registration_time: string;
  is_public: boolean;
}

export const register = async (username: string, password: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/register",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 409) {
      return RegistrationResult.UsernameTaken;
    }
    if (response.status === 429) {
      return RegistrationResult.RateLimited;
    }

    return RegistrationResult.UnknownError;
  }

  const data = (await response.json()) as ApiAuthLoginResponse;

  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  cookies().set("token", data.auth_token, {
    value: data.auth_token,
    expires: expiration,
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  });

  redirect("/");
};
