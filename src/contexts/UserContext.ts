import { createContext } from "react";

export type UserContextValue = {
  authToken?: string;
  username?: string;
  friendCode?: string;
  registrationTime?: Date;
  isPublic?: boolean;
};

const defaultValue: UserContextValue = {};

export const UserContext = createContext(defaultValue);
