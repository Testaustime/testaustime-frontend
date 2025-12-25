"use server";

import { PasswordChangeResult } from "../../types";
import { postRequestWithoutResponse } from "../../api/baseApi";

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  const res = await postRequestWithoutResponse("/auth/change-password", {
    old: oldPassword,
    new: newPassword,
  });

  if ("error" in res) {
    if (res.statusCode === 401) {
      return PasswordChangeResult.OldPasswordIncorrect;
    } else if (res.statusCode === 400) {
      return PasswordChangeResult.NewPasswordInvalid;
    }

    return PasswordChangeResult.UnknownError;
  }

  return PasswordChangeResult.Success;
};
