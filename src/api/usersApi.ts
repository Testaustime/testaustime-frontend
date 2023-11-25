import { redirect } from "next/navigation";
import {
  ActivityDataSummary,
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
} from "../types";
import { cookies } from "next/headers";

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

export const getOwnActivityData = async (token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/users/@me/activity/data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
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
