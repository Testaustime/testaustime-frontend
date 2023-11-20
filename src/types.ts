export interface ApiUsersUserResponse {
  id: number;
  username: string;
  friend_code: string;
  registration_time: string;
  is_public: boolean;
}

export interface ApiUsersUserActivityDataResponseItem {
  id: number;
  start_time: string;
  duration: number;
  project_name: string | null;
  language: string | null;
  editor_name: string | null;
  hostname: string | null;
}

export type ActivityDataEntry = Omit<
  ApiUsersUserActivityDataResponseItem,
  "start_time" | "project_name"
> & {
  start_time: Date;
  dayStart: Date;
  project_name: string | null;
};

export interface Leaderboard {
  member_count: number;
  name: string;
}

export interface LeaderboardData {
  name: string;
  invite: string;
  creation_time: string;
  members: {
    username: string;
    admin: boolean;
    time_coded: number;
  }[];
}

export enum JoinLeaderboardError {
  AlreadyMember,
  NotFound,
  UnknownError,
}

export enum CreateLeaderboardError {
  AlreadyExists,
  UnknownError,
}

export type ActivityDataSummaryEntry = {
  languages: Record<string, number>;
  total: number;
};

export type ActivityDataSummary = {
  all_time: ActivityDataSummaryEntry;
  last_month: ActivityDataSummaryEntry;
  last_week: ActivityDataSummaryEntry;
};

export enum PasswordChangeResult {
  Success,
  OldPasswordIncorrect,
  NewPasswordInvalid,
  UnknownError,
}

export enum AddFriendError {
  AlreadyFriends,
  NotFound,
  UnknownError,
}

export enum RegistrationResult {
  RateLimited,
  UnknownError,
}

export enum GetLeaderboardError {
  TooManyRequests,
}
