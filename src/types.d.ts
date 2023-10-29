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
