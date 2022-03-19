import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authTokenLocalStorageKey } from "../constants";

export interface UsersSlice {
  authToken: string,
  username: string,
  registrationTime: Date,
  friendCode: string
}

const initialState: UsersSlice = {
  authToken: localStorage.getItem(authTokenLocalStorageKey) || "",
  username: "",
  registrationTime: new Date(),
  friendCode: ""
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
    setRegisterTime: (state, action: PayloadAction<Date>) => {
      state.registrationTime = action.payload;
    },
    setFriendCode: (state, action: PayloadAction<string>) => {
      state.friendCode = action.payload;
    },
  },
});

export const { setAuthToken, setUsername, setRegisterTime, setFriendCode } = usersSlice.actions;
export default usersSlice.reducer;
