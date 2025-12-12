"use server";

import { redirect } from "next/navigation";
import {
  postRequestWithoutResponse,
  postRequestWithResponse,
} from "../../api/baseApi";

export const joinLeaderboard = (inviteCode: string) =>
  postRequestWithResponse<{
    name: string;
    member_count: number;
  }>("/leaderboards/join", {
    invite: inviteCode,
  });

export const leaveLeaderboard = async (leaderboardName: string) => {
  const data = await postRequestWithoutResponse(
    `/leaderboards/${leaderboardName}/leave`,
  );
  if ("error" in data) return data;

  redirect("/leaderboards");
};

export const deleteLeaderboard = async (leaderboardName: string) => {
  const data = await postRequestWithoutResponse(
    `/leaderboard/${leaderboardName}`,
    undefined,
    "DELETE",
  );

  if ("error" in data) {
    return data;
  }

  return redirect("/leaderboards");
};
