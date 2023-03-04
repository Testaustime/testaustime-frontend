import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiFriendsResponseItem } from "../hooks/useFriends";

export interface UsersSlice {
  authToken?: string,
  username?: string,
  registrationTime?: string,
  friendCode?: string,
  friends: ApiFriendsResponseItem[]
}

const initialState: UsersSlice = {
  authToken: undefined,
  username: undefined,
  registrationTime: undefined,
  friendCode: undefined,
  friends: []
};

export const usersSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | undefined>) => {
      state.username = action.payload;
    },
    setRegisterTime: (state, action: PayloadAction<string | undefined>) => {
      state.registrationTime = action.payload;
    },
    setFriendCode: (state, action: PayloadAction<string | undefined>) => {
      state.friendCode = action.payload;
    },
    setFriends: (state, action: PayloadAction<ApiFriendsResponseItem[]>) => {
      state.friends = action.payload;
    }
  }
});

export const {
  setAuthToken,
  setUsername,
  setRegisterTime,
  setFriendCode,
  setFriends
} = usersSlice.actions;
export default usersSlice.reducer;
