"use server";

import { redirect } from "next/navigation";
import {
  postRequestWithoutResponse,
  postRequestWithResponse,
} from "../../api/baseApi";
import { JoinLeaderboardError } from "../../types";

export const joinLeaderboard = async (inviteCode: string) => {
  const response = await postRequestWithResponse<{
    name: string;
    member_count: number;
  }>("/leaderboards/join", {
    invite: inviteCode,
  });

  if ("error" in response) {
    if (response.statusCode === 404) {
      return { error: JoinLeaderboardError.NotFound };
    } else if (response.statusCode === 409) {
      return { error: JoinLeaderboardError.AlreadyMember };
    }
  }

  return response;
};

export const leaveLeaderboard = async (leaderboardName: string) => {
  const data = await postRequestWithoutResponse(
    `/leaderboards/${leaderboardName}/leave`,
  );
  if ("error" in data) return data;

  redirect("/leaderboards");
};

export const deleteLeaderboard = async (leaderboardName: string) => {
  const data = await postRequestWithoutResponse(
    `/leaderboards/${leaderboardName}`,
    undefined,
    "DELETE",
  );

  if ("error" in data) {
    return data;
  }

  return redirect("/leaderboards");
};
