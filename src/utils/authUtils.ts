"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/require-await
export const logOutAndRedirect = async () => {
  cookies().delete("token");
  cookies().delete("secure-access-token");
  redirect("/");
};
