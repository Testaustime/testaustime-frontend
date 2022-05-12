import axios from "axios";
import { useEffect, useState } from "react";
import useAuthentication from "./UseAuthentication";

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
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<{ [leaderboardName: string]: LeaderboardData }>({});

  useEffect(() => {
    axios.get<Leaderboard[]>("/users/@me/leaderboards", {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    }).then(res => {
      setLeaderboards(res.data);
    }).catch(e => console.error(e));
  }, []);

  useEffect(() => {
    leaderboards.forEach(leaderboard => {
      axios.get<LeaderboardData>(`/leaderboards/${leaderboard.name}`, {
        headers: { Authorization: `Bearer ${token ?? ""}` }
      }).then(res => {
        setLeaderboardData({ ...leaderboardData, [leaderboard.name]: res.data });
      }).catch(e => console.error(e));
    });
  }, [leaderboards]);

  const joinLeaderboard = async (leaderboardCode: string) => {
    // TODO: Wait for https://github.com/Testaustime/testaustime-backend/pull/21 to get merged
    // After that member_count can be made non-nullable
    const res = await axios.post<{ name: string, member_count?: number }>("/leaderboards/join", {
      invite: leaderboardCode
    }, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });

    setLeaderboards([...leaderboards, { name: res.data.name, member_count: res.data.member_count ?? 0 }]);
  };

  const leaveLeaderboard = async (leaderboardName: string) => {
    await axios.post(`/leaderboards/${leaderboardName}/leave`, {}, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    });
    setLeaderboards(leaderboards.filter(leaderboard => leaderboard.name !== leaderboardName));
  };

  return {
    leaderboards: leaderboards.map(l => ({
      ...l,
      ...leaderboardData[l.name]
    })),
    joinLeaderboard,
    leaveLeaderboard
  };
};