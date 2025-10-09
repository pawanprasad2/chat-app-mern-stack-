import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, selectChat, subscribeToMessages, unsubscribeFromMessages } from"../redux/slice/ChatSlice"
import { selectAuth } from "../redux/slice/AuthSlice"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeliton";

const formatMessageTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function ChatContainer() {
  const dispatch = useDispatch();
  const { selectedUser, isMessagesLoading, messages } = useSelector(selectChat);
  const { authUser } = useSelector(selectAuth);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id));
      dispatch(subscribeToMessages());
    }
    return () => {
      dispatch(unsubscribeFromMessages());
    };
  }, [dispatch, selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a user to start chatting
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser?._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser?._id
                      ? authUser?.profilePic || "/assets/profilepic.avif"
                      : selectedUser?.profilePic || "/assets/profilepic.avif"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
