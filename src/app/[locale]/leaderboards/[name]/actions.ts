"use server";

import { postRequestWithoutResponse } from "../../../../api/baseApi";

export const regenerateInviteCode = (leaderboardName: string) =>
  postRequestWithoutResponse(`/leaderboards/${leaderboardName}/regenerate`);

export const promoteUser = (username: string, leaderboardName: string) =>
  postRequestWithoutResponse(`/leaderboards/${leaderboardName}/promote`, {
    user: username,
  });

export const demoteUser = (username: string, leaderboardName: string) =>
  postRequestWithoutResponse(`/leaderboards/${leaderboardName}/demote`, {
    user: username,
  });

export const kickUser = (username: string, leaderboardName: string) =>
  postRequestWithoutResponse(`/leaderboards/${leaderboardName}/kick`, {
    user: username,
  });
