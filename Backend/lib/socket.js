import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {};
export function getReceiverSocketId(userID) {
  return userSocketMap[userID];
}


io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  const userID = socket.handshake.query.userID;
  if (userID) userSocketMap[userID] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user is disconnect", socket.id);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
