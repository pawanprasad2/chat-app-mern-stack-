import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/check");
      return res.data;
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
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (data,thunkAPI)=>{
    try{
      const res = await axiosInstance.post("/auth/logout",data)
      toast.success("Logout successfully")
      return res.data
    }catch(error){
      toast.error(error.response?.data?.message)
    return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
  
)
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Logged in successfully");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updatedProfile = createAsyncThunk(
  "auth/updateProfile", async(data,thunkAPI)=>{
    try{
const res = await axiosInstance.put("/auth/updateProfile",data)
   toast.success("profile updated successfully")
   return res.data
    }catch(error){
      const msg =error.response?.data?.message || "update profile failed"
      toast.error(msg)
      return thunkAPI.rejectWithValue(msg)

    }
  }
)
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningup: false,
    isLoggingup: false,
    isUpdateingProfile: false,
    isCheckingAuth: true,
    signupError: null,
     loginError: null,
      onlineUsers: [], 
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
      .addCase(signup.pending, (state) => {
        (state.isSigningup = true), (state.signupError = null);
      })
      .addCase(signup.fulfilled, (state, action) => {
        (state.isSigningup = false), (state.authUser = action.payload);
      })
      .addCase(signup.rejected, (state, action) => {
        (state.isSigningup = false), (state.signupError = action.payload);
      })
      //logout
      .addCase(logout.fulfilled,(state)=>{
        state.authUser=null
      })
      .addCase(logout.rejected,(state,action)=>{
        state.signupError=action.payload
      })
        //login
      .addCase(login.pending, (state) => {
        state.isLoggingup = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingup = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingup = false;
        state.loginError = action.payload;
      })
         // profile update 
      .addCase(updatedProfile.pending, (state) => {
        state.isUpdateingProfile = true;
        state.profileError = null;
      })
      .addCase(updatedProfile.fulfilled, (state, action) => {
        state.isUpdateingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updatedProfile.rejected, (state, action) => {
        state.isUpdateingProfile = false;
        state.profileError = action.payload;
      });
  },
});
 export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
