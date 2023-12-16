"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginError } from "../../types";

export interface ApiAuthLoginResponse {
  id: number;
  auth_token: string;
  friend_code: string;
  username: string;
  registration_time: string;
  is_public: boolean;
}

export interface SecureAccessTokenResponse {
  token: string;
}

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

export const logIn = async (
  username: string,
  password: string,
  unsafeRedirect: string | null,
) => {
  const loginPromise = fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const secureAccessTokenPromise = fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/securedaccess",
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

  const [response, secureAccessTokenResponse] = await Promise.all([
    loginPromise,
    secureAccessTokenPromise,
  ]);

  if (!response.ok) {
    if (response.status === 401) {
      return { error: LoginError.InvalidCredentials };
    } else if (response.status === 429) {
      return { error: LoginError.RateLimited };
    } else {
      return { error: LoginError.UnknownError };
    }
  }

  if (!secureAccessTokenResponse.ok) {
    if (secureAccessTokenResponse.status === 401) {
      return { error: LoginError.InvalidCredentials };
    } else if (secureAccessTokenResponse.status === 429) {
      return { error: LoginError.RateLimited };
    } else {
      return { error: LoginError.UnknownError };
    }
  }

  const login = (await response.json()) as ApiAuthLoginResponse;
  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  cookies().set("token", login.auth_token, {
    value: login.auth_token,
    expires: expiration,
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  });

  const secureAccessToken =
    (await secureAccessTokenResponse.json()) as SecureAccessTokenResponse;
  const secureAccessTokenExpiration = new Date(Date.now() + 1000 * 60 * 60);
  cookies().set("secure-access-token", secureAccessToken.token, {
    value: secureAccessToken.token,
    expires: secureAccessTokenExpiration,
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
