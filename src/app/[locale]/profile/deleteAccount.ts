"use server";

import { cookies, headers } from "next/headers";
import { logOutAndRedirect } from "../../../utils/authUtils";

export const deleteAccount = async (username: string, password: string) => {
  const token = cookies().get("token")?.value;

  await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/@me/delete", {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "client-ip": headers().get("client-ip") ?? "Unknown IP",
      "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  await logOutAndRedirect();
};
