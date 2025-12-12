"use server";

import { cookies } from "next/headers";
import {
  postRequestWithoutResponse,
  postRequestWithResponse,
} from "../../../api/baseApi";

interface ApiAuthRegenerateResponse {
  token: string;
}

export const regenerateToken = async () => {
  const res =
    await postRequestWithResponse<ApiAuthRegenerateResponse>(
      "/auth/regenerate",
    );

  if ("error" in res) {
    return res;
  }

  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  cookies().set("token", res.data.token, {
    value: res.data.token,
    expires: expiration,
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  });
};

export const regenerateFriendCode = () =>
  postRequestWithoutResponse("/friends/regenerate");

export const changeAccountVisibility = (isPublic: boolean) =>
  postRequestWithoutResponse("/account/settings", {
    public_profile: isPublic,
  });
