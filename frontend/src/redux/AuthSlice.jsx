import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/check");
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "error in checkAuth"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningup: false,
    isLoggingup: false,
    isUpdateingProfile: false,
    isCheckingAuth: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        (state.authUser = action.playload), (state.isCheckingAuth = false);
      })
      .addCase(checkAuth.rejected, (state) => {
        (state.authUser = null), (state.isCheckingAuth = null);
      });
  },
});

export default authSlice.reducer;
