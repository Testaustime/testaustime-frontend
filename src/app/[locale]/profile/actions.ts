"use server";

import { revalidateTag } from "next/cache";
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

  revalidateTag("users/@me");
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

  revalidateTag("users/@me");
};
