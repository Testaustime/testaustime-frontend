import { redirect } from "next/navigation";
import {
  ActivityDataSummary,
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
  CurrentActivityApiResponse,
} from "../types";
import { cookies, headers } from "next/headers";
import { CurrentActivity } from "../components/CurrentActivity/CurrentActivity";

export const getMe = async () => {
  const token = cookies().get("token")?.value;
  if (!token) {
    redirect("/login");
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
