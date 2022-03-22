import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authTokenLocalStorageKey } from "../constants";

export interface UsersSlice {
  authToken: string,
  username: string,
  registrationTime: string,
  friendCode: string,
  friends: Array<string>
}

const initialState: UsersSlice = {
  authToken: localStorage.getItem(authTokenLocalStorageKey) || "",
  username: "",
  registrationTime: "",
  friendCode: "",
  friends: []
};

export const usersSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setRegisterTime: (state, action: PayloadAction<string>) => {
      state.registrationTime = action.payload;
    },
    setFriendCode: (state, action: PayloadAction<string>) => {
      state.friendCode = action.payload;
    },
    setFriends: (state, action: PayloadAction<Array<string>>) => {
      state.friends = action.payload;
    },
  },
});

export const { setAuthToken, setUsername, setRegisterTime, setFriendCode, setFriends } = usersSlice.actions;
export default usersSlice.reducer;
