import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UsersSlice {
  authToken: string
}

const initialState: UsersSlice = {
  // Should the pre-existing auth token be retrieved here, or when AppSetup is mounted??
  authToken: localStorage.getItem("authToken") || "",
};

export const usersSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
  },
});

export const { setAuthToken } = usersSlice.actions;
export default usersSlice.reducer;