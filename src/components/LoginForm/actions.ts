"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface ApiAuthLoginResponse {
  id: number;
  auth_token: string;
  friend_code: string;
  username: string;
  registration_time: string;
  is_public: boolean;
}

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

export const logIn = async (
  username: string,
  password: string,
  unsafeRedirect: string | null,
) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/login",
    {
      method: "POST",
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
    if (response.status === 401) {
      return { error: "Invalid username or password" as const };
    }

    return { error: "Unknown error" as const };
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

  const unsafeRedirectCalculated = unsafeRedirect ?? "/";

  redirect(
    allowedRedirects.includes(unsafeRedirectCalculated)
      ? unsafeRedirectCalculated
      : "/",
  );
};
