"use server";

import { cookies } from "next/headers";

export const renameProject = async (
  oldProjectName: string,
  newProjectName: string,
) => {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/activity/rename",
    {
      method: "POST",
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
};
