import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const themeSilce = createSlice({
  name: "theme",
  initialState,
  reducers: {
    tonggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { tonggleTheme } = themeSilce.actions;
export default themeSilce.reducer;
