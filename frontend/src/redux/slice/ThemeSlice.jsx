import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => localStorage.getItem("chat-theme") || "coffee";

const themeSlice = createSlice({
  name: "theme",
  initialState: { theme: getInitialTheme() },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("chat-theme", action.payload); // Save theme to localStorage
    },
  },
});

export const { setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.theme;
export default themeSlice.reducer;