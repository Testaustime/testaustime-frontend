"use server";

import { cookies, headers } from "next/headers";

export const renameProject = async (
  oldProjectName: string,
  newProjectName: string,
) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/activity/rename",
    {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify({
        from: oldProjectName,
        to: newProjectName,
      }),
      headers: {
        "Content-Type": "application/json",
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
