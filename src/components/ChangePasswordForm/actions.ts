"use server";

import { cookies, headers } from "next/headers";
import { PasswordChangeResult } from "../../types";

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  const token = cookies().get("token")?.value;
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/changepassword",
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
        old: oldPassword,
        new: newPassword,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return PasswordChangeResult.OldPasswordIncorrect;
    } else if (response.status === 400) {
      return PasswordChangeResult.NewPasswordInvalid;
    }

    return PasswordChangeResult.UnknownError;
  }

  return PasswordChangeResult.Success;
};
