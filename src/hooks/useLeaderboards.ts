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

  // TODO: Add the leaderboard to state
  const joinLeaderboard = (leaderboardCode: string) => {
    axios.post<{ name: string }>("/leaderboards/join", {
      invite: leaderboardCode
    }, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    }).then(res => {
      console.log(res.data);
    }).catch(e => console.error(e));
  };

  // TODO: Remove the leaderboard from state
  const leaveLeaderboard = (leaderboardName: string) => {
    axios.post(`/leaderboards/${leaderboardName}/leave`, {}, {
      headers: { Authorization: `Bearer ${token ?? ""}` }
    }).then(res => {
      console.log(res.data);
    }).catch(e => console.error(e));
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