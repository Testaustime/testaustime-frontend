"use server";

import { cookies } from "next/headers";
import { logOutAndRedirect } from "../../../utils/authUtils";

export const deleteAccount = async (username: string, password: string) => {
  const token = cookies().get("token")?.value;

  await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/@me/delete", {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  await logOutAndRedirect();
};
