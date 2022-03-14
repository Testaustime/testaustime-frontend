import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UsersSlice {
  authToken: string,
  username: string
}

const initialState: UsersSlice = {
  authToken: localStorage.getItem("authToken") || "",
  username: ""
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
    }
  },
});

export const { setAuthToken, setUsername } = usersSlice.actions;
export default usersSlice.reducer;