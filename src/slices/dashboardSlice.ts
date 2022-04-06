import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MiscSlice {
  selectedProjects: string[]
}

const initialState: MiscSlice = {
  selectedProjects: []
};

export const MiscSlice = createSlice({
  name: "miscSlice",
  initialState,
  reducers: {
    setSelectedProjects: (state, action: PayloadAction<string[]>) => {
      state.selectedProjects = action.payload;
    }
  },
});

export const { setSelectedProjects } = MiscSlice.actions;
export default MiscSlice.reducer;
