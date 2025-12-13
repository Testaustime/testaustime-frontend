"use server";

import {
  CreateLeaderboardError,
  GetLeaderboardError,
  Leaderboard,
  LeaderboardData,
} from "../types";
import { getRequest, postRequestWithResponse } from "./baseApi";

export const getMyLeaderboards = () =>
  getRequest<Leaderboard[]>("/users/@me/leaderboards");

export const getLeaderboard = async (leaderboardName: string) => {
  const data = await getRequest<LeaderboardData>(
    `/leaderboards/${leaderboardName}`,
  );

  if ("error" in data) {
    if (data.response.status === 404) {
      return { error: GetLeaderboardError.LeaderboardNotFound };
    }
  }

  return data;
};

export const createLeaderboard = async (leaderboardName: string) => {
  const data = await postRequestWithResponse<{ invite_code: string }>(
    "/leaderboards/create",
    {
      name: leaderboardName,
    },
  );

  if ("error" in data && data.statusCode === 409) {
    return {
      error: CreateLeaderboardError.AlreadyExists,
    };
  }

  return data;
};
