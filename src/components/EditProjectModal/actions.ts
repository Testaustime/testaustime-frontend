"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const renameProject = async (
  oldProjectName: string,
  newProjectName: string,
  username: string,
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
      },
    },
  );

  if (!response.ok) {
    return { error: "Unknown error" as const };
  }

  // TODO: Username is provided by the user, we shouldn't trust it
  revalidateTag(`activity-data-${username}`);
};
