export interface ApiFriendsResponseItem {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
}

export const getFriendsList = async (token: string) => {
  const friendsPromise = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/friends/list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 60,
        tags: ["friendsList"],
      },
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
