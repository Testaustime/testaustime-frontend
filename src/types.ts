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
  name: string;
  member_count: number;
  my_position: number;
  top_member: {
    id: number;
    username: string;
    admin: boolean;
    time_coded: 0;
  };
  me: {
    id: number;
    username: string;
    admin: boolean;
    time_coded: 0;
  };
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
  AlreadyMember = "AlreadyMember",
  NotFound = "NotFound",
}

export enum CreateLeaderboardError {
  AlreadyExists = "AlreadyExists",
}

type ActivityDataSummaryEntry = {
  languages: Record<string, number>;
  total: number;
};

export type ActivityDataSummary = {
  all_time: ActivityDataSummaryEntry;
  last_month: ActivityDataSummaryEntry;
  last_week: ActivityDataSummaryEntry;
};

export enum PasswordChangeResult {
  Success = "Success",
  OldPasswordIncorrect = "OldPasswordIncorrect",
  NewPasswordInvalid = "NewPasswordInvalid",
  UnknownError = "UnknownError",
}

export enum AddFriendError {
  AlreadyFriends = "Already friends",
  NotFound = "Not found",
}

export enum RegistrationResult {
  UsernameTaken = "Username taken",
}

export enum LoginError {
  InvalidCredentials = "Invalid credentials",
}

export type CurrentActivityApiResponse = {
  started: string;
  duration: number;
  heartbeat: {
    project_name: string;
    language: string;
    editor_name: string;
    hostname: string;
  };
};

export enum ChangeUsernameError {
  InvalidUsername = "Invalid username",
  UsernameTaken = "Username taken",
}

export enum GetUserActivityDataError {
  UserNotFound = "User not found",
}

export type SearchUsersResult = {
  id: number;
  username: string;
  registration_time: string;
};

export type SearchUsersApiResponse = SearchUsersResult[];

export enum GetRequestError {
  Unauthorized,
  RateLimited,
  UnknownError,
}

export enum PostRequestError {
  Unauthorized,
  RateLimited,
  UnknownError,
}

export enum GetLeaderboardError {
  LeaderboardNotFound = "Leaderboard not found",
}
