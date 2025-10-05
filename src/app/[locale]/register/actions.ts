"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegistrationResult } from "../../../types";
import { SecureAccessTokenResponse } from "../../../components/LoginForm/actions";

interface ApiAuthLoginResponse {
  id: number;
  auth_token: string;
  friend_code: string;
  username: string;
  registration_time: string;
  is_public: boolean;
}

export const register = async (
  username: string,
  password: string,
  email?: string,
) => {
  const body = email
    ? JSON.stringify({
        username: username,
        email: email,
        password: password,
      })
    : JSON.stringify({
        username: username,
        password: password,
      });

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/register",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      body: body,
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

  const secureAccessTokenResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/securedaccess",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    },
  );

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

  const secureAccessTokenData =
    (await secureAccessTokenResponse.json()) as SecureAccessTokenResponse;
  const secureAccessTokenExpiration = new Date(Date.now() + 1000 * 60 * 60);
  cookies().set("secure-access-token", secureAccessTokenData.token, {
    value: secureAccessTokenData.token,
    expires: secureAccessTokenExpiration,
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  });

  redirect("/");
};
