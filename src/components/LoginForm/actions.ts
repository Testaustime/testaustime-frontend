"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginError } from "../../types";
import { postRequestWithResponse } from "../../api/baseApi";

interface ApiAuthLoginResponse {
  id: number;
  auth_token: string;
  friend_code: string;
  username: string;
  registration_time: string;
  is_public: boolean;
}

const allowedRedirects = [
  "/profile",
  "/friends",
  "/leaderboards",
  "/authorize?editor=vscode",
];

export const logIn = async (
  username: string,
  password: string,
  unsafeRedirect: string | null,
) => {
  const res = await postRequestWithResponse<ApiAuthLoginResponse>(
    "/auth/login",
    {
      username,
      password,
    },
  );

  if ("error" in res) {
    if (res.statusCode === 401) {
      return { error: LoginError.InvalidCredentials };
    }

    return res;
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

  const unsafeRedirectCalculated = unsafeRedirect ?? "/";

  redirect(
    allowedRedirects.includes(unsafeRedirectCalculated)
      ? unsafeRedirectCalculated
      : "/",
  );
};
