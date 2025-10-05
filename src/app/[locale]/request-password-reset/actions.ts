"use server";

import { headers } from "next/headers";
import { PasswordResetRequestResult } from "../../../types";

export const requestPasswordReset = async (email: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/reset-password",
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      body: JSON.stringify({
        email: email,
      }),
    },
  );

  if (!response.ok) {
    if (response.status == 429) {
      return PasswordResetRequestResult.RateLimited;
    }

    return PasswordResetRequestResult.UnknownError;
  }

  return PasswordResetRequestResult.Success;
};
