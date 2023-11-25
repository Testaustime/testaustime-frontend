import { startOfDay } from "date-fns";
import {
  ActivityDataEntry,
  ApiUsersUserActivityDataResponseItem,
} from "../types";
import { normalizeProgrammingLanguageName } from "../utils/programmingLanguagesUtils";
import { cookies } from "next/headers";

export interface ApiFriendsResponseItem {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
}

export const getFriendsList = async () => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return {
      error: "Unauthorized" as const,
    };
  }

  const friendsPromise = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friends/list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    },
  );

  if (!friendsPromise.ok) {
    if (friendsPromise.status === 401) {
      return {
        error: "Unauthorized" as const,
      };
    }

    if (friendsPromise.status === 429) {
      return {
        error: "Too many requests" as const,
      };
    }

    return {
      error: "Unknown error" as const,
    };
  }

  const data = (await friendsPromise.json()) as ApiFriendsResponseItem[];

  return data;
};

export const getFriendActivityData = async (username: string) => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return {
      error: "Unauthorized" as const,
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/activity/data`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return {
        error: "Unauthorized" as const,
      };
    }

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

  const mappedData: ActivityDataEntry[] = data.map((e) => ({
    ...e,
    start_time: new Date(e.start_time),
    dayStart: startOfDay(new Date(e.start_time)),
    language: normalizeProgrammingLanguageName(e.language),
  }));

  return mappedData;
};
