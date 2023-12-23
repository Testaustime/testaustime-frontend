"use server";

import { cookies } from "next/headers";
import { ChangeUsernameError } from "../../types";

export const changeUsername = async (newUsername: string) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/changeusername",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        new: newUsername,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 400) {
      return { error: ChangeUsernameError.InvalidUsername };
    } else if (response.status === 401) {
      return { error: ChangeUsernameError.Unauthorized };
    } else if (response.status === 429) {
      return { error: ChangeUsernameError.RateLimited };
    } else if (response.status === 409) {
      return { error: ChangeUsernameError.UsernameTaken };
    }

    const errorText = await response.text();
    console.log(
      "Unknown error when changing username: status",
      response.status,
      errorText,
    );
    return { error: ChangeUsernameError.UnknownError };
  }
};
