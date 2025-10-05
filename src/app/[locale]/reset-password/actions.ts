"use server";

import { headers } from "next/headers";
import { PasswordResetResult } from "../../../types";

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/complete-password-reset",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      body: JSON.stringify({
        token: token,
        password: password,
      }),
    },
  );

  if (!response.ok) {
    if (response.status == 429) {
      return PasswordResetResult.RateLimited;
    }

    if (response.status == 400) {
      return PasswordResetResult.InvalidToken;
    }

    return PasswordResetResult.UnknownError;
  }

  return PasswordResetResult.Success;
};
