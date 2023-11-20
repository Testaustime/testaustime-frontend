"use server";

import { cookies } from "next/headers";

interface ApiAuthRegenerateResponse {
  token: string;
}

export const regenerateToken = async () => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/regenerate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    return { error: "Unknown error" as const };
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
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/friends/regenerate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" as const };
  }
};

export const changeAccountVisibility = async (isPublic: boolean) => {
  const token = cookies().get("token")?.value;
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/account/settings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        public_profile: isPublic,
      }),
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" as const };
  }
};
