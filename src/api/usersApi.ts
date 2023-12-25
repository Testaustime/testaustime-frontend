import {
  ActivityDataEntry,
  ActivityDataSummary,
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
  CurrentActivityApiResponse,
  GetUserActivityDataError,
  SearchUsersApiResponse,
  SearchUsersError,
} from "../types";
import { cookies, headers } from "next/headers";
import { CurrentActivity } from "../components/CurrentActivity/CurrentActivity";
import { startOfDay } from "date-fns";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";

export const getMe = async () => {
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
      error: "Unknown error" as const,
    };
  }

  const data = (await meResponse.json()) as ApiUsersUserResponse;

  return data;
};

export const getOwnActivityData = async (username: string) => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return {
      error: "Unauthorized" as const,
    };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/users/@me/activity/data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
      next: {
        tags: [`activity-data-${username}`],
      },
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return {
        error: "Too many requests" as const,
      };
    }

    return {
      error: "Unknown error" as const,
    };
  }

  const data =
    (await response.json()) as ApiUsersUserActivityDataResponseItem[];

  return data;
};

export const getOwnActivityDataSummary = async () => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return {
      error: "Unauthorized" as const,
    };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/users/@me/activity/summary",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return {
        error: "Too many requests" as const,
      };
    }

    return {
      error: "Unknown error" as const,
    };
  }

  const data = (await response.json()) as ActivityDataSummary;

  return data;
};

export const getCurrentActivityStatus = async (username: string) => {
  const token = cookies().get("token")?.value;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/activity/current`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
      cache: "no-cache",
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return {
        error: "Too many requests" as const,
      };
    }

    if (response.status === 404) {
      return null;
    }

    const error = await response.text();
    console.error(
      `Error while fetching current activity: status ${response.status},`,
      error,
    );
    return {
      error: "Unknown error" as const,
    };
  }

  const data = (await response.json()) as CurrentActivityApiResponse;

  return {
    language: data.heartbeat.language,
    startedAt: data.started,
    projectName: data.heartbeat.project_name,
  } satisfies CurrentActivity;
};

export const getUserActivityData = async (username: string) => {
  const token = cookies().get("token")?.value;

  const h = new Headers();
  if (token) {
    // When https://github.com/Testaustime/testaustime-backend/issues/72 is fixed, we can
    // remove this check and just use the token directly.
    h.append("Authorization", `Bearer ${token}`);
  }
  h.append("client-ip", headers().get("client-ip") ?? "Unknown IP");
  h.append("bypass-token", process.env.RATELIMIT_IP_FORWARD_SECRET ?? "");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/activity/data`,
    {
      cache: "no-cache",
      headers: h,
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: GetUserActivityDataError.Unauthorized };
    } else if (response.status === 404) {
      return { error: GetUserActivityDataError.NotFound };
    } else if (response.status === 429) {
      return { error: GetUserActivityDataError.RateLimited };
    }

    const error = await response.text();
    console.error(
      "Error while getting user's activity data: status",
      response.status,
      error,
    );
    return { error: GetUserActivityDataError.UnknownError };
  }

  const data =
    (await response.json()) as ApiUsersUserActivityDataResponseItem[];

  const mappedData: ActivityDataEntry[] = data.map((e) => ({
    ...e,
    start_time: new Date(e.start_time),
    dayStart: startOfDay(new Date(e.start_time)),
    language: normalizeProgrammingLanguageName(e.language),
  }));

  return mappedData;
};

export const searchUsers = async (query: string) => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/search/users?keyword=${encodeURIComponent(query)}`,
    {
      cache: "no-cache",
      headers: {
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return { error: SearchUsersError.RateLimited };
    }

    console.error(
      "Error while searching users: status",
      response.status,
      await response.text(),
    );

    return { error: SearchUsersError.UnknownError };
  }

  const data = (await response.json()) as SearchUsersApiResponse;

  return data;
};
