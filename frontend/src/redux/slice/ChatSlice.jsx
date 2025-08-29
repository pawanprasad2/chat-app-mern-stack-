// src/redux/slice/chatSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

// ---------- Thunks ----------
export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/message/user");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data);
    }
  }
);

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

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, messageData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/message/send/${userId}`,
        messageData
      );
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      return rejectWithValue(error.response?.data);
    }
  }
);
export const getUnreadCounts = createAsyncThunk(
  "chat/getUnreadCounts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/message/unread");
      return res.data; // array of { _id: senderId, count }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch unread counts");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/message/mark-read/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ---------- Slice ----------
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    unreadCounts: {},
  },
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    addMessage(state, action) {
      const msg = action.payload;
      state.messages.push(msg);
      // increment unread if this user isn't currently selected
      if (state.selectedUser?._id !== msg.senderId) {
        state.unreadCounts[msg.senderId] = (state.unreadCounts[msg.senderId] || 0) + 1;
      }
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
      })

      // getMessages
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })

      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isSendingMessage = false;
      })
      // unread counts
      .addCase(getUnreadCounts.fulfilled, (state, action) => {
        state.unreadCounts = action.payload || {}; // ✅ direct object
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        state.unreadCounts[action.payload] = 0; // ✅ reset count for that user
      });
  },
});

// ---------- Socket Message Handling ----------
let messageListenerAttached = false;

export const subscribeToMessages = () => (dispatch, getState) => {
  const { selectedUser } = getState().chat;
  const { authUser } = getState().auth;

  if (!selectedUser || !authUser) return;

  // we already keep socket inside authSlice.js global `socket`
  const socket = window.socket; // injected from authSlice connectSocket()

  if (!socket || messageListenerAttached) return;

  socket.on("newMessage", (newMessage) => {
    const isMessageFromSelectedUser =
      newMessage.senderId === selectedUser._id ||
      newMessage.receiverId === selectedUser._id;

    if (isMessageFromSelectedUser) {
      dispatch(addMessage(newMessage));
    }
  });

  messageListenerAttached = true;
};

export const unsubscribeFromMessages = () => (dispatch, getState) => {
  const socket = window.socket;
  if (!socket) return;
  socket.off("newMessage");
  messageListenerAttached = false;
};

// ---------- Exports ----------
export const { setSelectedUser, clearMessages, addMessage } = chatSlice.actions;
export const selectChat = (state) => state.chat;
export default chatSlice.reducer;
