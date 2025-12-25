"use server";

import { logOutAndRedirect } from "../../../utils/authUtils";
import { postRequestWithoutResponse } from "../../../api/baseApi";

export const deleteAccount = async (username: string, password: string) => {
  const res = await postRequestWithoutResponse(
    "/users/@me/delete",
    {
      username,
      password,
    },
    "DELETE",
  );

  if ("error" in res) return res;

  await logOutAndRedirect();
};
