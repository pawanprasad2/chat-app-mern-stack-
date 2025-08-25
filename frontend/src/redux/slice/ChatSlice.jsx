import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk(
    "chat/getUsers",
    async(_,{rejectWithValue }) =>{
        try{
            const res =await axiosInstance.get("/message/user")
           return res.data
        }catch(error){
              toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data);

        }
    }
)  

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      return rejectWithValue(error.response?.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
  },
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    // getUsers
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      });

    // getMessages
    builder
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      });
  },
});

export const { setSelectedUser, clearMessages } = chatSlice.actions;

export const selectChat = (state) => state.chat;

export default chatSlice.reducer;