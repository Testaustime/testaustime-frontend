import axios from "axios";
import useAuthentication from "./UseAuthentication";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";

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

export type CombinedLeaderboard = Leaderboard & LeaderboardData;

export const useLeaderboards = () => {
  const { token } = useAuthentication();
  const queryClient = useQueryClient();

  const { data: leaderboards } = useQuery("leaderboards", async () => {
    const response = await axios.get<Leaderboard[]>("/users/@me/leaderboards", {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    return response.data;
  }, {
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  const leaderboardData = useQueries((leaderboards ?? []).map(leaderboard => ({
    queryKey: ["leaderboardData", leaderboard.name],
    queryFn: async () => {
      const response = await axios.get<LeaderboardData>(`/leaderboards/${leaderboard.name}`,
        { headers: { Authorization: `Bearer ${token ?? ""}` } });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    onSuccess: (leaderboard: LeaderboardData) => {
      queryClient.setQueriesData(["leaderboardData", leaderboard.name], leaderboard);
    }
  })));

  const { mutateAsync: joinLeaderboard } = useMutation(async (leaderboardCode: string) => {
    const res = await axios.post<{ name: string, member_count: number }>("/leaderboards/join", {
      invite: leaderboardCode
    }, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    return res.data;
  }, {
    onSuccess: data => {
      queryClient.setQueriesData("leaderboards", (leaderboards ?? []).concat(data));
    }
  });

  const { mutateAsync: leaveLeaderboard } = useMutation(async (leaderboardName: string) => {
    await axios.post(`/leaderboards/${leaderboardName}/leave`, {}, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    return leaderboardName;
  }, {
    onSuccess: leaderboardName => {
      queryClient.setQueriesData("leaderboards",
        (leaderboards ?? []).filter(leaderboard => leaderboard.name !== leaderboardName));
    }
  });

  const { mutateAsync: createLeaderboard } = useMutation(async (leaderboardName: string) => {
    const res = await axios.post<{ invite_code: string }>("/leaderboards/create", {
      name: leaderboardName
    }, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    return res.data;
  }, {
    onSuccess: (_data, leaderboardName) => {
      queryClient.setQueriesData("leaderboards", (leaderboards ?? []).concat({
        member_count: 0,
        name: leaderboardName
      }));
    }
  });

  const { mutateAsync: deleteLeaderboard } = useMutation(async (leaderboardName: string) => {
    await axios.delete(`/leaderboards/${leaderboardName}`, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    return leaderboardName;
  }, {
    onSuccess: leaderboardName => {
      queryClient.setQueriesData("leaderboards",
        (leaderboards ?? []).filter(leaderboard => leaderboard.name !== leaderboardName));
    }
  });

  const { mutateAsync: setUserAdminStatus } = useMutation(async (
    { leaderboardName, adminStatus, username }: { leaderboardName: string, username: string, adminStatus: boolean }
  ) => {
    await axios.post(`/leaderboards/${leaderboardName}/${adminStatus ? "promote" : "demote"}`, {
      user: username
    }, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
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
    }, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
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
    const res = await axios.post<{ invite_code: string }>(`/leaderboards/${leaderboardName}/regenerate`, {}, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
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
    leaderboards: (leaderboards ?? []).map(l => ({
      ...l,
      ...(leaderboardData.find(leaderboard => leaderboard.data?.name === l.name)?.data)
    })),
    joinLeaderboard,
    leaveLeaderboard,
    createLeaderboard,
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
    kickUser,
    regenerateInviteCode
  };
};
