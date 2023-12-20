"use server";

import { cookies, headers } from "next/headers";
import {
  ChangeAccountVisibilityError,
  RegenerateAuthTokenError,
} from "../../../types";

interface ApiAuthRegenerateResponse {
  token: string;
}

export const regenerateToken = async () => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/regenerate",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: RegenerateAuthTokenError.Unauthorized };
    } else if (response.status === 429) {
      return { error: RegenerateAuthTokenError.RateLimited };
    } else {
      console.log(response.status, await response.text());
      return { error: RegenerateAuthTokenError.UnknownError };
    }
  }

  const data = (await response.json()) as ApiAuthRegenerateResponse;

  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  cookies().set("token", data.token, {
    value: data.token,
    expires: expiration,
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  });
};

export const regenerateFriendCode = async () => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/friends/regenerate",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" as const };
  }
};

export const changeAccountVisibility = async (isPublic: boolean) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/account/settings",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      body: JSON.stringify({
        public_profile: isPublic,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: ChangeAccountVisibilityError.Unauthorized };
    } else if (response.status === 429) {
      return { error: ChangeAccountVisibilityError.RateLimited };
    }

    return { error: ChangeAccountVisibilityError.UnknownError };
  }
};
