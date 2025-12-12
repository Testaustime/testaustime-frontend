"use server";

import { ChangeUsernameError } from "../../types";
import { postRequestWithoutResponse } from "../../api/baseApi";

export const changeUsername = async (newUsername: string) => {
  const res = await postRequestWithoutResponse("/auth/change-username", {
    new: newUsername,
  });

  if ("error" in res) {
    if (res.statusCode === 400) {
      return { error: ChangeUsernameError.InvalidUsername };
    } else if (res.statusCode === 409) {
      return { error: ChangeUsernameError.UsernameTaken };
    }
    return res;
  }
};
