import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, selectChat } from "../redux/slice/ChatSlice";
import { selectAuth } from "../redux/slice/AuthSlice";
import { X } from "lucide-react";

function ChatHeader() {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(selectChat);
  const { onlineUsers } = useSelector(selectAuth);

  if (!selectedUser) return null; // prevent crash if no user is selected

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/assets/profilepic.avif"}
                alt={selectedUser.firstName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.firstName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right: Close button */}
        <button onClick={() => dispatch(setSelectedUser(null))}>
          <X />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
