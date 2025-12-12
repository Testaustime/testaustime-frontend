import { CurrentActivityApiResponse } from "../types";
import { getRequest } from "./baseApi";

export interface ApiFriendsResponseItem {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
  status: CurrentActivityApiResponse | null;
}

export const getFriendsList = () =>
  getRequest<ApiFriendsResponseItem[]>("/friends/list");
