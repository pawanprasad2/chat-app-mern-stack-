import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
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
export const signup = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      return res.data; // Return user data, not status
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
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
    signupError:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    //checkauth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        (state.authUser = action.payload), (state.isCheckingAuth = false);
      })
      .addCase(checkAuth.rejected, (state) => {
        (state.authUser = null), (state.isCheckingAuth = false);
      })
      //signup
      .addCase(signup.pending,(state)=>{
        state.isSigningup=true,
        state.signupError=null
      })
      .addCase(signup.fulfilled,(state,action)=>{
        state.isSigningup=false,
        state.authUser=action.payload
      })
      .addCase(signup.rejected,(state,action)=>{
        state.isSigningup=false,
        state.signupError=action.payload
      })
  },
});

export default authSlice.reducer;
