import axios from "../axios";
import { isAxiosError } from "axios";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Leaderboard {
  member_count: number,
  name: string
}

export interface LeaderboardData {
  name: string,
  invite: string,
  creation_time: string,
  members: {
    username: string,
    admin: boolean,
    time_coded: number
  }[]
}

export enum JoinLeaderboardError {
  AlreadyMember,
  NotFound,
  UnknownError
}

export enum CreateLeaderboardError {
  AlreadyExists,
  UnknownError
}

export const useLeaderboards = ({
  initialLeaderboards,
  shouldFetch
}: {
  initialLeaderboards?: LeaderboardData[],
  shouldFetch?: boolean
} = { shouldFetch: true }) => {
  const queryClient = useQueryClient();

  const { data: leaderboards } = useQuery(["leaderboards"], async () => {
    const response = await axios.get<Leaderboard[]>("/users/@me/leaderboards");
    return response.data;
  }, {
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: initialLeaderboards?.map(leaderboard => ({
      member_count: leaderboard.members.length,
      name: leaderboard.name
    })),
    enabled: shouldFetch
  });

  const leaderboardData = useQueries({
    queries: (leaderboards ?? []).map(leaderboard => ({
      queryKey: ["leaderboardData", leaderboard.name],
      queryFn: async () => {
        const response = await axios.get<LeaderboardData>(`/leaderboards/${leaderboard.name}`);
        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      onSuccess: (leaderboard: LeaderboardData) => {
        queryClient.setQueriesData(["leaderboardData", leaderboard.name], leaderboard);
      },
      placeholderData: initialLeaderboards?.find(l => l.name === leaderboard.name),
      enabled: shouldFetch
    }))
  });

  const { mutateAsync: joinLeaderboard } = useMutation(async (leaderboardCode: string) => {
    const res = await axios.post<{ name: string, member_count: number }>("/leaderboards/join", {
      invite: leaderboardCode
    });
    return res.data;
  }, {
    onSuccess: async data => {
      queryClient.setQueriesData(["leaderboards"], (leaderboards ?? []).concat(data));
      await queryClient.invalidateQueries(["leaderboardData", data.name]);
    }
  });

  const { mutateAsync: leaveLeaderboard } = useMutation(async (leaderboardName: string) => {
    await axios.post(`/leaderboards/${leaderboardName}/leave`, {});
    return leaderboardName;
  }, {
    onSuccess: leaderboardName => {
      queryClient.setQueriesData(["leaderboards"],
        (leaderboards ?? []).filter(leaderboard => leaderboard.name !== leaderboardName));
    }
  });

  const { mutateAsync: createLeaderboard } = useMutation(async (leaderboardName: string) => {
    const res = await axios.post<{ invite_code: string }>("/leaderboards/create", {
      name: leaderboardName
    });
    return res.data;
  }, {
    onSuccess: (_data, leaderboardName) => {
      queryClient.setQueriesData(["leaderboards"], (leaderboards ?? []).concat({
        member_count: 0,
        name: leaderboardName
      }));
    }
  });

  const { mutateAsync: deleteLeaderboard } = useMutation(async (leaderboardName: string) => {
    await axios.delete(`/leaderboards/${leaderboardName}`);
    return leaderboardName;
  }, {
    onSuccess: leaderboardName => {
      queryClient.setQueriesData(["leaderboards"],
        (leaderboards ?? []).filter(leaderboard => leaderboard.name !== leaderboardName));
    }
  });

  const { mutateAsync: setUserAdminStatus } = useMutation(async (
    { leaderboardName, adminStatus, username }: { leaderboardName: string, username: string, adminStatus: boolean }
  ) => {
    await axios.post(`/leaderboards/${leaderboardName}/${adminStatus ? "promote" : "demote"}`, { user: username });
    return { leaderboardName, username, adminStatus };
  }, {
    onSuccess: ({ leaderboardName, username, adminStatus }) => {
      const leaderboard = leaderboardData.find(leaderboard => leaderboard.data?.name === leaderboardName)?.data;

      queryClient.setQueriesData(["leaderboardData", leaderboardName], {
        ...leaderboard,
        members: leaderboard?.members.map(member => {
          return member.username === username ? { ...member, admin: adminStatus } : member;
        })
      });
    }
  });

  const { mutateAsync: kickUser } = useMutation(async (
    { leaderboardName, username }: { leaderboardName: string, username: string }
  ) => {
    await axios.post(`/leaderboards/${leaderboardName}/kick`, {
      user: username
    });
    return { leaderboardName, username };
  }, {
    onSuccess: ({ leaderboardName, username }) => {
      const leaderboard = leaderboardData.find(leaderboard => leaderboard.data?.name === leaderboardName)?.data;
      queryClient.setQueriesData(["leaderboardData", leaderboardName], {
        ...leaderboard,
        members: leaderboard?.members.filter(member => member.username !== username)
      });
    }
  });

  const { mutateAsync: regenerateInviteCode } = useMutation(async (leaderboardName: string) => {
    const res = await axios.post<{ invite_code: string }>(`/leaderboards/${leaderboardName}/regenerate`, {});
    return { leaderboardName, inviteCode: res.data.invite_code };
  }, {
    onSuccess: ({ leaderboardName, inviteCode }) => {
      const leaderboard = leaderboardData.find(leaderboard => leaderboard.data?.name === leaderboardName)?.data;
      queryClient.setQueriesData(["leaderboardData", leaderboardName], {
        ...leaderboard,
        invite: inviteCode
      });
    }
  });

  return {
    leaderboards: leaderboardData
      .map(leaderboard => leaderboard.data)
      .filter((leaderboard): leaderboard is LeaderboardData => !!leaderboard),
    joinLeaderboard: async (inviteCode: string) => {
      try {
        return await joinLeaderboard(inviteCode);
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response?.status === 409
            // TODO: The 403 status is a bug with the backend.
            // It can be removed when https://github.com/Testaustime/testaustime-backend/pull/61 is merged
            || e.response?.status === 403) {
            return JoinLeaderboardError.AlreadyMember;
          }
          else if (e.response?.status === 404) {
            return JoinLeaderboardError.NotFound;
          }
        }
        return JoinLeaderboardError.UnknownError;
      }
    },
    leaveLeaderboard,
    createLeaderboard: async (leaderboardName: string) => {
      try {
        return await createLeaderboard(leaderboardName);
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response?.status === 409
            // TODO: The 403 status is a bug with the backend.
            // It can be removed when https://github.com/Testaustime/testaustime-backend/pull/61 is merged
            || e.response?.status === 403
          ) {
            return CreateLeaderboardError.AlreadyExists;
          }
        }
        return CreateLeaderboardError.UnknownError;
      }
    },
    deleteLeaderboard,
    promoteUser: (leaderboardName: string, username: string) => setUserAdminStatus({
      leaderboardName,
      username,
      adminStatus: true
    }),
    demoteUser: (leaderboardName: string, username: string) => setUserAdminStatus({
      leaderboardName,
      username,
      adminStatus: false
    }),
    setUserAdminStatus,
    kickUser: (leaderboardName: string, username: string) => kickUser({ leaderboardName, username }),
    regenerateInviteCode:
      async (leaderboardName: string) => { return (await regenerateInviteCode(leaderboardName)).inviteCode; }
  };
};
