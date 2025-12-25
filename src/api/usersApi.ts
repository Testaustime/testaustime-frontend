"use server";

import {
  ActivityDataEntry,
  ActivityDataSummary,
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
  CurrentActivityApiResponse,
  GetUserActivityDataError,
  SearchUsersApiResponse,
} from "../types";
import { cookies, headers } from "next/headers";
import { CurrentActivity } from "../components/CurrentActivity/CurrentActivity";
import { startOfDay } from "date-fns";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import { getRequest } from "./baseApi";

export const getMe = async () => {
  if (process.env.NEXT_PUBLIC_API_URL == null)
    throw new Error("API URL was not defined");

  const token = cookies().get("token")?.value;
  if (!token) {
    return undefined;
  }

  const meResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
    },
  );

  if (meResponse.status === 401) {
    return {
      error: "Unauthorized" as const,
    };
  }

  if (meResponse.status === 429) {
    return {
      error: "Too many requests" as const,
    };
  }

  if (!meResponse.ok) {
    return {
      error: "Unknown error when fetching /users/@me" as const,
      status: meResponse.status,
    };
  }

  const data = (await meResponse.json()) as ApiUsersUserResponse;

  return data;
};

export const getOwnActivityData = () =>
  getRequest<ApiUsersUserActivityDataResponseItem[]>(
    "/users/@me/activity/data",
  );

export const getOwnActivityDataSummary = () =>
  getRequest<ActivityDataSummary>("/users/@me/activity/summary");

export const getCurrentActivityStatus = async (username: string) => {
  const data = await getRequest<CurrentActivityApiResponse>(
    `/users/${username}/activity/current`,
  );

  if ("error" in data) {
    if (data.response.status === 404) {
      const errorJson = (await data.response.json()) as unknown;
      if (
        errorJson !== null &&
        typeof errorJson === "object" &&
        "error" in errorJson &&
        typeof errorJson.error === "string"
      ) {
        if (errorJson.error === "The user has no active session") {
          return null;
        }
      }
    }
    return data;
  }

  return {
    language: data.heartbeat.language,
    startedAt: data.started,
    projectName: data.heartbeat.project_name,
  } satisfies CurrentActivity;
};

export const getUserActivityData = async (username: string) => {
  const data = await getRequest<ApiUsersUserActivityDataResponseItem[]>(
    `/users/${username}/activity/data`,
  );

  if ("error" in data) {
    if (data.response.status === 404) {
      return { error: GetUserActivityDataError.UserNotFound };
    }
    return data;
  }

  const mappedData: ActivityDataEntry[] = data.map((e) => ({
    ...e,
    start_time: new Date(e.start_time),
    dayStart: startOfDay(new Date(e.start_time)),
    language: normalizeProgrammingLanguageName(e.language),
  }));

  return mappedData;
};

export const searchUsers = async (query: string) =>
  getRequest<SearchUsersApiResponse>(
    `/search/users?keyword=${encodeURIComponent(query)}`,
  );
